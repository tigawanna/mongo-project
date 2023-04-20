import { logError } from "../utils/helpers";
import { GroupedRepo } from "./schema";

export async function getGroupedRepos() {
    try {
        const result = await GroupedRepo.aggregate([
            {
                $match: {
                    favdeps: { $exists: true }
                }
            },
            {
                $unwind: "$favdeps"
            },
            {
                $group: {
                    _id: {
                        pkg_type: "$pkg_type",
                        favdep: "$favdeps"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    count: -1
                }
            },
            {
                $group: {
                    _id: "$_id.pkg_type",
                    top_favdeps: { $push: "$_id.favdep" }
                }
            },
            {
                $project: {
                    _id: 1,
                    top_favdeps: { $slice: ["$top_favdeps", 20] }
                }
            }
        ]).exec();

        return result;
    } catch (error) {
        logError("error fetching aggregated mongo records", error);
        throw error;
    }
}
