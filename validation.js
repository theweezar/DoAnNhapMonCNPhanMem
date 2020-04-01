const validations = {
  validateEmail: (email = "") => {
    // Check structure
    let l1 = /.+@\w+(.\w+){1,}/g;
    // Check whitespace exists or not
    let l2 = /\s+/g;
    // check domain string is empty or not ?
    let l3 = /\w+$/g;
    // Check none-character is repeated or not ?
    let l4 = /(\W+){2,}/g;
    // Check mark if it exists in string ?
    let l5 = /(['"])/g;
    return (
      l1.test(email) && !l2.test(email) && 
      l3.test(email) && !l4.test(email) && 
      !l5.test(email) 
      ? true:false
    );
  },
  validateString: (str = "") => {
    // if str exists all this none-character, this func will return false 
    let l1 = /(["'\\|${}()])+/g;
    return !l1.test(str);
  },
  validateName: (name = "") => {
    let l1 = /\W+/g;
    let l2 = /([0-9])/g;
    return (!l1.test(name) || !l2.test(name) ? true:false);
  },
  validatePassword: (password = "") => {
    let l1 = /([A-Z])/g;
    let l2 = /([0-9])/g;
    let l3 = /\W+/g;
    return (l1.test(password) && l2.test(password) && l3.test(password) ? true:false); 
  }
}

module.exports = validations;