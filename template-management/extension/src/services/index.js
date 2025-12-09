export const postPayloadToEthosPipeline = async (payload, authenticatedEthosFetch, pipeline) => {
    const response = await authenticatedEthosFetch(pipeline, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload }),
    });

    let responseData;
    try {
        responseData = await response.json();
    } catch (err) {
        responseData = { message: "Invalid JSON response from server" };
    }

    if (!response.ok) {
        const error = responseData?.errors?.[0];
        const errorMessage = error?.description || error?.message || "Failed to post payload to Ethos pipeline";
        throw new Error(errorMessage);
    }

    return responseData;
};
export const putPayloadToEthosPipeline = async (payload, authenticatedEthosFetch, pipeline) => {
    const response = await authenticatedEthosFetch(pipeline, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload }),
    });

    let responseData;
    try {
        responseData = await response.json();
    } catch (err) {
        responseData = { message: "Invalid JSON response from server" };
    }

    if (!response.ok) {
        const error = responseData?.errors?.[0];
        const errorMessage = error?.description || error?.message || "Failed to post payload to Ethos pipeline";
        throw new Error(errorMessage);
    }

    return responseData;
};


export const getFromEthosPipeline = async (authenticatedEthosFetch, pipeline) => {

    const response = await authenticatedEthosFetch(pipeline, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    let responseData;
    try {
        responseData = await response.json();
    } catch (err) {
        responseData = { message: "Invalid JSON response from server" };
    }

    if (!response.ok) {
        const error = responseData?.errors?.[0];
        if (error instanceof Error) {
            console.log("It’s a proper Error:", error.message);
        } else {
            console.log("It's a plain object or something else:", error);
        }
        const errorMessage = error?.description || error?.message || "Failed to post payload to Ethos pipeline";
        throw new Error(errorMessage);
    }

    return responseData;
};