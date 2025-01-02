export interface IFooterSection {
    _id?: string,
    legalAndContactInfo: legalAndContactInfo,
    socialMedias: IsocialMedia[]
}

export interface IsocialMedia {
    socialMedia: string
    link: string
    image: string
    name: string
}

export interface legalAndContactInfo {
    copyright: string
    address: string
    phoneNumber: number
}