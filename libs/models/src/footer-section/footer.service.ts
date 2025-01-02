import { IFooterSection } from "./footer.interface";
import { FooterSection } from "./footer.model";

export const createFooterSection = async (
  payload: IFooterSection,
): Promise<IFooterSection> => {
  const findFooterData = await FooterSection.find();
  if(findFooterData){
    const updateFooterSection = await findFooterData[0].updateOne(payload);
    return updateFooterSection;
  }else {
    const footerSection = await FooterSection.create(payload);
    return footerSection;
  }
};

export const getFooterSection = async () => {
  const result = await FooterSection.find({});
  return result;
};

export const getLocation = async() => {
  const result = await FooterSection.findOne({legalAndContactInfo:{$exists:true}});
  return result;
}