/*
We dont need those
console.log('Client-side code running');

function postBtn(){
  fetch('/api/shorturl/new', {method: 'POST'})
    .then(function(response) {
      if(response.ok) {
        console.log('Click was recorded');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
}
*/