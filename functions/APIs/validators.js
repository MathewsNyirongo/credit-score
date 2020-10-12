const isEmpty = (string) => {
    if (string.trim() === '') {
        return true;
    } else {
        return false;
    }
}

exports.validateLoginData = (data) => {
    let errors = {};
    if (isEmpty(data.email)) {
        errors = 'Must not be empty';
    }

    if (isEmpty(data.password)) {
        errors = 'Must not be empty';
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
};