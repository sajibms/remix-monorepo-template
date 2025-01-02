import { IContactUs } from "@acme/types";
import { OtherSettings } from "./other-settings.model";

export const createContactUs = async (payload: IContactUs) => {
    const existOtherSettings = await OtherSettings.find();

    if(existOtherSettings){
        const updateDoc = await existOtherSettings[0].updateOne({contactus:payload});
        return updateDoc;
    } else {
        const result = await OtherSettings.create({contactus:payload});
        return result;
    }
}

export const getContactUs = async() => {
    const result = await OtherSettings.findOne({contactus:{$exists:true}});
    return result;
}

export const getOtherSettings = async() => {
    const result = await OtherSettings.findOne({});
    return result;
}