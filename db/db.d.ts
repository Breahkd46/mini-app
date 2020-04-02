import {Model, Connection} from "mongoose"

// export interface CityModel {
//     name: string;
// }

module.exports = {
    db: Connection,
    City: Model
}