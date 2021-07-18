import cleanseInput from './cleanseInput';

export default function validateInput(input, type, requirements) { // return error if there is, return blank for no error
    let cleanedInput = cleanseInput(input);
    if (requirements.canBeEmpty !== undefined && !requirements.canBeEmpty && cleanedInput === '') {
        return 'Cannot be empty';
    }
    if (type === 'number') {
        if (isNaN(cleanedInput)) {
            return 'Must be a number';
        }
        cleanedInput = Number.parseFloat(cleanedInput);
        let requirementsDescription = '';
        let passesInputValidation = true;
        if (requirements.moreThanOrEqualTo !== undefined) {
            requirementsDescription = `Must be more than or equal to ${requirements.moreThanOrEqualTo}`;
            if (cleanedInput < requirements.moreThanOrEqualTo) {
                passesInputValidation = false;
            }
        } else if (requirements.moreThan !== undefined) {
            requirementsDescription = `Must be more than ${requirements.moreThan}`;
            if (cleanedInput <= requirements.moreThan) {
                passesInputValidation = false;
            }
        }

        if (requirements.lessThanOrEqualTo !== undefined) {
            if (requirementsDescription === '') {
                requirementsDescription = `Must be more than or equal to ${requirements.moreThanOrEqualTo}`;
            } else {
                requirementsDescription = `${requirementsDescription} and less than or equal to ${requirements.lessThanOrEqualTo}`;
            }
            if (cleanedInput > requirements.lessThanOrEqualTo) {
                passesInputValidation = false;
            }
        } else if (requirements.lessThan !== undefined) {
            if (requirementsDescription === '') {
                requirementsDescription = `Must be more than ${requirements.moreThanOrEqualTo}`;
            } else {
                requirementsDescription = `${requirementsDescription} and less than ${requirements.lessThan}`;
            }
            if (cleanedInput >= requirements.lessThan) {
                passesInputValidation = false;
            }
        }

        if (passesInputValidation) {
            return '';
        }
        return requirementsDescription;
    }
    if (type === 'string') {
        // nothing yet
        return '';
    }
    return '';
}
