import moment from "moment/moment";

export default function dateHelper(date){
    return moment(date).local().format("YYYY-MM-DD HH:mm:ss")
}