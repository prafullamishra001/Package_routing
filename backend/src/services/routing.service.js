const { DEPARTMENTS, WEIGHT_LIMITS, VALUE_THRESHOLD_EUR } = require('../config/constants');

const routeParcel = (parcel) => {
  const { weight, value, destinationCountry } = parcel;
  const reasons = [];
  let department;

  if (weight <= WEIGHT_LIMITS.MAIL_MAX_KG) {
    department = DEPARTMENTS.MAIL;
    reasons.push(`Weight <= ${WEIGHT_LIMITS.MAIL_MAX_KG} kg`);
  } else if (weight <= WEIGHT_LIMITS.REGULAR_MAX_KG) {
    department = DEPARTMENTS.REGULAR;
    reasons.push(`Weight <= ${WEIGHT_LIMITS.REGULAR_MAX_KG} kg`);
  } else {
    department = DEPARTMENTS.HEAVY;
    reasons.push(`Weight > ${WEIGHT_LIMITS.REGULAR_MAX_KG} kg`);
  }

  if (destinationCountry === 'Switzerland') {
    department = DEPARTMENTS.CUSTOMS;
    reasons.push('Destination is Switzerland');
  }

  const insuranceRequired = value > VALUE_THRESHOLD_EUR;
  if (insuranceRequired) {
    reasons.push(`Value > €${VALUE_THRESHOLD_EUR}`);
  }

  return {
    department,
    insuranceRequired,
    reason: reasons,
  };
};

module.exports = {
  routeParcel,
};
