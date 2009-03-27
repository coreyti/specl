function puts(message) {
  if(console && console.info) {
    console.info(message);
  }
}

function raises_exception(fn) {
  try {
    fn();
  }
  catch(e) {
    return true;
  }
  return false;
}
