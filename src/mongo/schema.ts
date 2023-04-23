import mongoose from "mongoose";

export interface IGroupedRepo{
    name: string
    // type: string
    devDependencies: {[key:string]:string }
    dependencies:{[key:string]:string}
    pkg_type: string
    favdeps: string[]
} 


const GroupedRepoSchema = new mongoose.Schema<IGroupedRepo>({
    name: {type: String,required: true},
    // type: {type: String,required: true},
    devDependencies: {type: Object},
    dependencies:{type: Object},
    pkg_type: {type: String,required: true},
    favdeps: {type:[String]}
}, { collection: 'grouped' });

export const GroupedRepo = mongoose.model("grouped", GroupedRepoSchema)


