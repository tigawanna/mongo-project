import { logError } from "../utils/helpers";
import { GroupedRepo } from "./schema";

export async function getGroupedRepos() {
    try {
        const result = await GroupedRepo.aggregate(
            [
                {
                    "$group": {
                        "_id": "$pkg_type",
                        "repo_names": { "$push": "$name" },
                        "top_favdeps": { "$push": "$favdeps" }
                    }
                },
                {
                    "$unwind": "$top_favdeps"
                },
                {
                    $sort: {
                        "top_favdeps": -1
                    }
                },
                {
                    "$unwind": "$top_favdeps"
                },
                {
                    "$group": {
                        "_id": "$_id",
                        "repo_names": { "$first": "$repo_names" },
                        "top_favdeps": { "$addToSet": "$top_favdeps" }
                    }
                }
            ]

        
        ).exec();

        return result;
    } catch (error) {
        logError("error fetching aggregated mongo records", error);
        throw error;
    }
}
