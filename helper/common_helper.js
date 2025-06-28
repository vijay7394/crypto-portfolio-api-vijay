
const mailBox     = require('is-disposable-email-domain')
const DisposalEmailCheck  =require('../disposalEmail.json')

exports.checkValidEmail = async(email)=>{
	try {
		let getEmail = email.split("@")[1]
		let validCheck = mailBox.isDisposable(getEmail)
		let DisposalEmail =DisposalEmailCheck.indexOf(getEmail==-1)
		if (validCheck === false && DisposalEmail === -1) {
			return false
		}
		else{
			return true
		}
		
	} catch(error) {
		return true
	}
}