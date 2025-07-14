import PortAuthority from "../models/PortAuthority.model.js";
import CompletedContract from "../models/CompletedContract.model.js"; // Import your CompletedContract model
export const getAllCompletedContracts = async (req, res) => {
  try {
    const userId = req.user.id;

    // Step 1: Find PortAuthority associated with user
    const portAuthority = await PortAuthority.findOne({ user: { _id: userId } });

    if (!portAuthority) {
      return res.status(404).json({ error: "PortAuthority not found" });
    }

    // Step 2: Fetch contracts with matching portAuthority ObjectId
    const contracts = await CompletedContract.find({
      portAuthority: portAuthority._id
    });

    res.status(200).json(contracts);
  } catch (error) {
    console.error("Error fetching completed contracts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
