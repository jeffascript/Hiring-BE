import axios from "axios";

export const getNewGeo = async (req, res, next) => {
    if (req.body.city) {
        const { city } = req.body;

        try {
            const response = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${process.env.OCD_API_KEY}&language=en&pretty=1`
            );

            const resp = await response.data.results[0].geometry;

            const newGeo = Object.values(resp);

            req.body.geometry = { type: "Point", coordinates: newGeo };

            next();
        } catch (error) {
            console.log(error);
        }
    }
};

export const getGeo = async (city) => {
    try {
        const response = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${process.env.OCD_API_KEY}&language=en&pretty=1`
        );

        console.log(response.data.results[0].geometry);
        return await response.data.results[0].geometry;
    } catch (error) {
        console.log(error);
    }
};

export const getCity = async (latitude, longitude) => {
    try {
        const geoPoint = encodeURIComponent(latitude + "," + longitude);
        const response = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${geoPoint}&key=${process.env.OCD_API_KEY}&language=en&pretty=1`
        );

        console.log(response.data.results[0].formatted);
        return await response.data.results[0].formatted;
    } catch (error) {
        console.log(error);
    }
};
