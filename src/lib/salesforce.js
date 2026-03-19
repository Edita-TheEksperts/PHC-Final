import jsforce from "jsforce";

export async function getSalesforceConnection() {
  const conn = new jsforce.Connection({
    loginUrl: "https://test.salesforce.com", // change to production if needed
  });

  await conn.login(
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN
  );

  return conn;
}

function mapResidencePermit(value) {
  if (!value) return null;

  const map = {
    "B": "Yes",          // Example: treat B permit as "Yes"
    "C": "Yes",          // treat C permit as "Yes"
    "L": "In Progress",  // example: map L to "In Progress"
    "None": "No",        // treat None as "No"
  };

  return map[value] || null; // Only return valid picklist values
}


export async function createOrUpdateSalesforceAccount(user) {
  const conn = await getSalesforceConnection();

  if (user.salesforceId) {
    await conn.sobject("Account").update({
      Id: user.salesforceId,
      FirstName: user.firstName,
      LastName: user.lastName,
    });
    return user.salesforceId;
  }

  const existing = await conn.sobject("Account")
    .findOne({ LastName: user.lastName, FirstName: user.firstName });

  if (existing) {
    return existing.Id;
  }

  const account = await conn.sobject("Account").create({
    FirstName: user.firstName,
    LastName: user.lastName,
  });

  if (!account.success) {
    throw new Error("Salesforce Account creation failed");
  }

  return account.id;
}

export async function createOrUpdateSalesforceCaregiver(employee) {
  const conn = await getSalesforceConnection();

  if (employee.salesforceId) {
    await conn.sobject("Caregivers__c").update({
      Id: employee.salesforceId,
      Name: `${employee.firstName} ${employee.lastName}`,
      Email__c: employee.email,
      Mobile_Number__c: employee.phone || null,
      Address__c: employee.address || null,
Residence_Permit__c: mapResidencePermit(employee.residencePermit),
      Work_Experience_in_year__c: parseInt(employee.experienceYears, 10) || 0,
      Driver_s_license__c: employee.hasLicense || false,
      Healthcare__c: employee.healthcare || false,
      Daily_support_and_errands__c: employee.dailySupport || false,
      Domestic_help_and_home_care__c: employee.homeCare || false,
      Leisure_and_social_activities__c: employee.socialActivities || false,
    });
    return employee.salesforceId;
  }

  const caregiver = await conn.sobject("Caregivers__c").create({
    Name: `${employee.firstName} ${employee.lastName}`,
    Email__c: employee.email,
    Mobile_Number__c: employee.phone || null,
    Address__c: employee.address || null,
    Residence_Permit__c: mapResidencePermit(employee.residencePermit),
    Work_Experience_in_year__c: parseInt(employee.experienceYears, 10) || 0,
    Driver_s_license__c: employee.hasLicense || false,
    Healthcare__c: employee.healthcare || false,
    Daily_support_and_errands__c: employee.dailySupport || false,
    Domestic_help_and_home_care__c: employee.homeCare || false,
    Leisure_and_social_activities__c: employee.socialActivities || false,
  });

  if (!caregiver.success) {
    throw new Error(JSON.stringify(caregiver.errors));
  }

  return caregiver.id;
}
