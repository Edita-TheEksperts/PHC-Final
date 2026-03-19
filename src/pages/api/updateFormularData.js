import { prisma } from "../../lib/prisma"

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { id, ...formData } = req.body
    if (!id) return res.status(400).json({ error: "User ID fehlt" })

    // ❌ Fushat e ndaluara
    const {
      passwordHash,
      role,
      createdAt,
      updatedAt,
      cardNumber,
      cvc,
      expiryDate,
      paymentIntentId,
      stripeCustomerId,
      stripePaymentMethodId,
      resetToken,
      resetTokenExpiry,
      salesforceId,
      ...cleanFormData
    } = formData

    const allowedFields = [
      "firstName", "lastName", "email", "phone", "address", "postalCode", "frequency",
      "emergencyContactName", "emergencyContactPhone",
      "careCity", "careStreet", "carePhone", "carePostalCode", "careHasParking",
      "careArrivalConditions", "careEntrance", "careEntranceDetails",
      "languages", "pets", "hasAllergies", "allergyDetails",
      "behaviorTraits", "healthFindings", "mobilityAids", "physicalState",
      "mentalDiagnoses", "incontinenceTypes",
      "householdPeople", "householdRooms",
      "specialRequests", "shoppingWithClient", "transport", "outings", "reads", "playsCards"
    ]

    const finalData = {}

    allowedFields.forEach((field) => {
      if (cleanFormData[field] !== undefined) {
        finalData[field] = cleanFormData[field]
      }
    })

    await prisma.user.update({
      where: { id },
      data: finalData,
    })

    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ error: "Interner Serverfehler" })
  }
}
