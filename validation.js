const validations = {
  emailFilter: (email = "") => {
    // --/.+@\w+(.\w+){1,}/g - Check structure
    // --/\s+/g - Check whitespace
    // --/\w+$/g - Check domain
    // --/(\W+){2,}/g - Check none-character repeat
    let l1 = /.+@\w+(.\w+){1,}/g;
    let l2 = /\s+/g;
    let l3 = /\w+$/g;
    let l4 = /(\W+){2,}/g;
    
  }
}

module.exports = validations;