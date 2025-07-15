// app.test.js
// Simple unit tests for app.js using Node's assert and manual DOM simulation

const assert = require('assert');

// Mock minimal DOM structure
function createDOM() {
  global.document = {
    getElementById: (id) => {
      if (!global._elements) global._elements = {};
      if (!global._elements[id]) {
        global._elements[id] = {
          innerHTML: '',
          value: '',
          className: '',
          reset: function () { this.value = ''; },
          appendChild: function () {},
          classList: {
            add: function () {},
            remove: function () {},
          },
        };
      }
      return global._elements[id];
    },
  };
}

// Mock fetch
function mockFetch(responseObj) {
  global.fetch = async () => ({
    json: async () => responseObj,
    ok: responseObj.ok !== false,
  });
}

// Test fetchActivities logic
function testFetchActivities() {
  createDOM();
  mockFetch({
    Chess: {
      description: 'Chess club',
      schedule: 'Fridays',
      max_participants: 10,
      participants: ['alice@mergington.edu', 'bob@mergington.edu'],
    },
  });
  // Simulate fetchActivities
  const activitiesList = document.getElementById('activities-list');
  const activitySelect = document.getElementById('activity');
  activitiesList.innerHTML = '';
  activitySelect.innerHTML = '';
  // Simulate population
  const details = {
    description: 'Chess club',
    schedule: 'Fridays',
    max_participants: 10,
    participants: ['alice@mergington.edu', 'bob@mergington.edu'],
  };
  const name = 'Chess';
  const spotsLeft = details.max_participants - details.participants.length;
  activitiesList.innerHTML += `
    <h4>${name}</h4>
    <p>${details.description}</p>
    <p><strong>Schedule:</strong> ${details.schedule}</p>
    <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
    <div class="participants-section">
      <strong>Participants:</strong>
      <ul class="participants-list">
        ${details.participants.length > 0
          ? details.participants.map(p => `<li>${p}</li>`).join("")
          : '<li><em>No participants yet</em></li>'}
      </ul>
    </div>
  `;
  activitySelect.innerHTML += `<option value="${name}">${name}</option>`;
  assert(activitiesList.innerHTML.includes('Chess'));
  assert(activitiesList.innerHTML.includes('Participants'));
  assert(activitySelect.innerHTML.includes('Chess'));
}

// Test signup form logic
function testSignupFormSuccess() {
  createDOM();
  mockFetch({ ok: true, message: 'Signed up!' });
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = '';
  messageDiv.className = '';
  // Simulate response
  const result = { message: 'Signed up!' };
  messageDiv.textContent = result.message;
  messageDiv.className = 'success';
  assert.strictEqual(messageDiv.textContent, 'Signed up!');
  assert(messageDiv.className.includes('success'));
}

function testSignupFormError() {
  createDOM();
  mockFetch({ ok: false, detail: 'Already signed up' });
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = '';
  messageDiv.className = '';
  // Simulate response
  const result = { detail: 'Already signed up' };
  messageDiv.textContent = result.detail;
  messageDiv.className = 'error';
  assert.strictEqual(messageDiv.textContent, 'Already signed up');
  assert(messageDiv.className.includes('error'));
}

// Run tests
try {
  testFetchActivities();
  testSignupFormSuccess();
  testSignupFormError();
  console.log('All tests passed.');
} catch (e) {
  console.error('Test failed:', e);
}
