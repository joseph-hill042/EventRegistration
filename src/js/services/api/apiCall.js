const timeoutDuration = 5000;

export default function apiCall(route, body = {}, method='GET') {

  const request = new Promise((resolve, reject) => {

    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    const requestDetails = {
      method,
      mode: 'cors',
      headers,
    };
    if (method === 'POST') requestDetails.body = JSON.stringify(body);

    function handleErrors(res) {
      if (res.ok) {
        res.message = 'Registration successful!';
        console.log(res);
        return res.json();
      } else {
        throw Error(res.statusText)
      }
    }

    fetch(`${API}/${route}.json`, requestDetails)
      .then(handleErrors)
      .then(resolve)
      .catch(reject);
  });

  const timeout = new Promise((resolve, reject) => {
    setTimeout(reject, timeoutDuration, 'Request timed out!');
  });

  return new Promise((resolve, reject) => {
    Promise.race([request, timeout])
      .then(resolve)
      .catch(reject);
  });
}
