export const getIP = () => fetch('https://icanhazip.com/')
  .then(function(response) {
    console.log(response);
    return response.text();
  });
  