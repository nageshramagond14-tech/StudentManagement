/**
 * Test Authentication Endpoints
 * 
 * This script tests the complete authentication flow:
 * 1. User signup
 * 2. User login
 * 3. Protected route access
 */

const http = require('http');

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function testAuth() {
  console.log('=== Testing Authentication Flow ===\n');

  try {
    // Test 1: User Signup
    console.log('1. Testing User Signup...');
    const signupOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/signup',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const timestamp = Date.now();
    const signupData = JSON.stringify({
      name: 'Test User',
      email: `testuser${timestamp}@example.com`,
      password: 'test123'
    });

    const signupResponse = await makeRequest(signupOptions, signupData);
    console.log(`Status: ${signupResponse.statusCode}`);
    console.log(`Response: ${signupResponse.body}\n`);

    if (signupResponse.statusCode === 201) {
      const signupResult = JSON.parse(signupResponse.body);
      const token = signupResult.data.token;
      console.log('Signup successful! Token received.');

      // Test 2: User Login
      console.log('2. Testing User Login...');
      const loginOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const loginData = JSON.stringify({
        email: `testuser${timestamp}@example.com`,
        password: 'test123'
      });

      const loginResponse = await makeRequest(loginOptions, loginData);
      console.log(`Status: ${loginResponse.statusCode}`);
      console.log(`Response: ${loginResponse.body}\n`);

      if (loginResponse.statusCode === 200) {
        const loginResult = JSON.parse(loginResponse.body);
        const authToken = loginResult.data.token;
        console.log('Login successful! Auth token received.');

        // Test 3: Protected Route Access
        console.log('3. Testing Protected Route (Get Profile)...');
        const profileOptions = {
          hostname: 'localhost',
          port: 5000,
          path: '/api/auth/profile',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          }
        };

        const profileResponse = await makeRequest(profileOptions);
        console.log(`Status: ${profileResponse.statusCode}`);
        console.log(`Response: ${profileResponse.body}\n`);

        if (profileResponse.statusCode === 200) {
          console.log('Protected route access successful!');

          // Test 4: Student Route (should require authentication)
          console.log('4. Testing Student Route (Protected)...');
          const studentsOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/students',
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${authToken}`,
            }
          };

          const studentsResponse = await makeRequest(studentsOptions);
          console.log(`Status: ${studentsResponse.statusCode}`);
          console.log(`Response: ${studentsResponse.body}\n`);

          if (studentsResponse.statusCode === 200) {
            console.log('Student route access successful!');
          } else {
            console.log('Student route access failed.');
          }
        } else {
          console.log('Protected route access failed.');
        }
      } else {
        console.log('Login failed.');
      }
    } else {
      console.log('Signup failed.');
    }

    console.log('\n=== Authentication Test Complete ===');

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
testAuth();
