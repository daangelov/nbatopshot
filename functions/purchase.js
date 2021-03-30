import axios from "axios";

function initiatePurchase(data) {

    const requestBody = JSON.stringify({
        input: {
            momentID: data.momentID, // "9bfe5d31-e3fd-469e-929c-adaedaa86b89",
            momentFlowID: data.momentFlowID, // "4576112",
            momentName: data.momentName, // "Evan Fournier #15427",
            momentDescription: "",
            momentImageURL: data.momentImageURL, // "https://assets.nbatopshot.com/editions/2_base_set_common/3cd32a2f-8590-4c1d-bdfe-dc00f117b1c4/play_3cd32a2f-8590-4c1d-bdfe-dc00f117b1c4_2_base_set_common_capture_Hero_2880_2880_Black.jpg",
            price: data.price, // "8.00000000",
            sellerID: data.sellerID, // "google-oauth2|112597948282507021870",
            redirectURL: data.redirectURL, // "https://nbatopshot.com/order/moment-purchase/{{ORDER_ID}}",
            // "recaptchaToken": "03AGdBq26FZTeTNDnFf2vWa3_q_zB1rg3jTghEC7PKVgva71lPvUjZiTSaZAV6-rZWRyo-13cfAxAsuAsXGr3RDz9MZL1OFt0vm1TDmbuPQQmOC7eQ30yIebT8GYWofNGTxqSiiPoCahNxToBp-bIAFYSjPU-Axf8XRVwdG0y8ZChbK9IJMSid8s4ma9bOR8eGgQt1cS0nDaRUyO5IXL6kUL7FIehGSBnqYGg4J5MwFbOC1DrwJlDZwZHACVCawfBj53327UGf89f5U4UxyRwNk2qt82V_wGP41gZbqwpphiGlt9hd-XraOk2RkKO_pn1nIlBuSUXmBYn01tjYBONhM2vaDz_EgqmNi_CvZt96WoagieVmGl_oB8SQG7Hh0fWdz5C2qNW9A8cJffHxgfiWsIC3q--7-3CrWqZU3_Jbl12cEJnWM8u-fB_3tKG_bG1yCc6xBBy2XGBl8cRC1mvq7XWKTkCOdFjt2zKJp0XpP88BMAgsgd8JUzw"
        }
    });

    const config = {
        method: 'post',
        url: 'https://api.nbatopshot.com/marketplace/graphql?PurchaseP2PMomentMutation',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': '__cfduid=d6fe05776f4e70a98f341f057323e24bc1615410374'
        },
        data: requestBody,
    }

    axios(config).then()


}
