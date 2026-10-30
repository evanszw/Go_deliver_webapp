const http = require('http');

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: body ? {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      } : {}
    };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({status: res.statusCode, body: body}));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  console.log('=== Submit Booking Request ===');
  const booking = await request('POST', '/api/requests', {
    customerName: 'John Doe',
    customerPhone: '+263 77 123 4567',
    pickupAddress: '123 Main St, CBD',
    deliveryDestination: '456 Oak Ave, Borrowdale',
    serviceId: 'srv-1',
    itemDescription: 'Documents',
    additionalInstructions: 'Please call on arrival',
    preferredDateTime: '2026-11-01T10:00:00'
  });
  console.log('Status:', booking.status);
  console.log('Body:', booking.body);

  const bookingData = JSON.parse(booking.body);
  const ref = bookingData.request?.referenceNumber;

  if (ref) {
    console.log('\n=== Get Request by Reference ===');
    const getReq = await request('GET', `/api/requests/${ref}`);
    console.log('Status:', getReq.status);
    console.log('Body:', getReq.body);
  }

  console.log('\n=== All tests completed ===');
}

main().catch(console.error);
