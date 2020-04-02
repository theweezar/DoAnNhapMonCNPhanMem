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
      ? email:""
    );
  },
  validateString: (str = "") => {
    // if str exists all this none-character, this func will return false 
    // let l1 = /(["'\\|${}()])+/g;
    return (!(/(["'\\|${}()])+/g).test(str) ? str:"");
  },
  validateName: (name = "") => {
    // let l1 = /\W+/g;
    // let l2 = /([0-9])/g;
    return (!(/\W+/g).test(name) || !(/([0-9])/g).test(name) ? name:"");
  },
  validatePassword: (password = "") => {
    // let l1 = /([A-Z])/g;
    // let l2 = /([0-9])/g;
    // let l3 = /\W/g;
    return (
      (/([A-Z])/g).test(password) && (/([0-9])/g).test(password) && 
      !(/\W+/g).test(password) && password.length >= 9 && password.length <= 20 ? password:""
    ); 
  }
}

module.exports = validations;