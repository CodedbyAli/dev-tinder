
const validateProfileUpdate = (reqData) => {

    const fillables = ['firstName','lastName','age', 'gender', 'skills', 'imageUrl','about'];

    isUpdateAllowed =  Object.keys(reqData).every(field => fillables.includes(field));

    return isUpdateAllowed;
}

module.exports = {validateProfileUpdate};