/* eslint-disable no-useless-catch */
const API_URL = import.meta.env.VITE_APP_API_URL;
//admin
export const getUser = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/admin/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const updateUserData = async ({
  token,
  name,
  email,
  phone,
  address,
  media_url,
}) => {
  const formdata = new FormData();
  formdata.append("name", name);
  formdata.append("email", email);
  formdata.append("phone", phone);
  formdata.append("address", address);
  formdata.append("image", media_url);

  const response = await fetch(`${API_URL}/dashboard/v1/admin/update`, {
    method: "POST",
    body: formdata,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.msg || "An error occurred while updating the user data"
    );
  }

  return result.data;
};

//doctors
export const getDoctors = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/doctors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getSpecificDoctor = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/doctors/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const deleteDoctor = async ({ id, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/doctors/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while deleting the doctor"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const updateDoctor = async ({
  id,
  name,
  bio,
  _method = "PATCH",
  token,
  address,
  email,
  phone,
  media,
  job_title,
  specialization_id,
  hospital_ids = [],
  is_visitor,
  isAbleToCancel,
}) => {
  const formdata = new FormData();

  formdata.append("name", name);
  formdata.append("_method", _method);
  formdata.append("bio", bio);
  formdata.append("address", address);
  formdata.append("email", email);
  formdata.append("phone", phone);
  formdata.append("is_visitor", is_visitor);
  formdata.append("is_special", isAbleToCancel);

  hospital_ids.forEach((id) => {
    formdata.append("hospital_ids[]", id);
  });
  if (media && !(typeof media === "string")) {
    formdata.append("media", media);
  }
  formdata.append("job_title", job_title);
  formdata.append("specialization_id", specialization_id);
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/doctors/${id}`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (Array.isArray(result.errors)) {
        console.error("Validation Errors:", result.errors);
        throw new Error(result.errors.join(", "));
      } else {
        throw new Error(
          result.message || "An error occurred while updating the doctor"
        );
      }
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const addDoctor = async ({
  name,
  bio,
  token,
  address,
  email,
  phone,
  media,
  job_title,
  specialization_id,
  hospital_ids = [],
  is_visitor,
  isAbleToCancel,
}) => {
  const formdata = new FormData();

  formdata.append("name", name);
  formdata.append("bio", bio);
  formdata.append("address", address);
  formdata.append("email", email);
  formdata.append("phone", phone);
  formdata.append("is_visitor", is_visitor);
  formdata.append("is_special", isAbleToCancel);

  hospital_ids.forEach((id) => {
    formdata.append("hospital_ids[]", id);
  });
  if (media && !(typeof media === "string")) {
    formdata.append("media", media);
  }
  formdata.append("job_title", job_title);
  formdata.append("specialization_id", specialization_id);
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/doctors`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (Array.isArray(result.errors)) {
        console.error("Validation Errors:", result.errors);
        throw new Error(result.errors.join(", "));
      } else {
        throw new Error(
          result.message || "An error occurred while adding the doctor"
        );
      }
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const restoreDoctor = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/doctors/${id}/restore`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while restoring the doctors"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getTrashedDoctor = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/trashed/doctors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
//hospitals

export const getSpecificHospital = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/hospitals/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();

      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const newHospital = async ({
  token,
  name,
  bio,
  description,
  password,
  active,
  lat,
  long,
  city_id,
  email,
  address,
  state_id,
  media = [],
  doctor_ids = [],
  specialization_id = [],
}) => {
  const formdata = new FormData();

  formdata.append("name", name);
  formdata.append("address", address);
  formdata.append("bio", bio);
  formdata.append("description", description);
  formdata.append("password", password);
  formdata.append("email", email);
  formdata.append("active", active ? "1" : "0");
  formdata.append("lat", lat);
  formdata.append("long", long);
  if (city_id) {
    formdata.append("city_id", city_id);
  }
  if (state_id) {
    formdata.append("state_id", state_id);
  }

  media.forEach((file) => {
    formdata.append("media[]", file);
  });

  doctor_ids.forEach((id) => {
    formdata.append("doctor_ids[]", id);
  });
  if (specialization_id) {
    specialization_id.forEach((id) => {
      formdata.append("specialization_id[]", id);
    });
  }

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/hospitals`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getHospitals = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/hospitals`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const updateHospital = async ({
  id,
  _method = "PATCH",
  token,
  name,
  bio,
  description,
  active,
  lat,
  long,
  city_id,
  address,
  email,
  previousEmail,
  state_id,
  start_visit_from,
  end_visit_at,
  visit_time,
  media = [],
  open_visits,
  old_media = [],
  doctor_ids = [],
  specialization_id = [],
  password,
}) => {
  const formdata = new FormData();
  formdata.append("address", address);
  formdata.append("name", name);
  formdata.append("_method", _method);
  formdata.append("bio", bio);
  formdata.append("description", description);
  formdata.append("lat", lat);
  formdata.append("long", long);
  formdata.append("city_id", city_id);
  formdata.append("state_id", state_id);
  formdata.append("start_visit_from", start_visit_from);
  formdata.append("end_visit_at", end_visit_at);
  formdata.append("visit_time", visit_time);
  formdata.append("open_visits", open_visits);
  formdata.append("active", active);
  formdata.append("password", password);

  if (email && email !== previousEmail) {
    formdata.append("email", email);
  }

  old_media.forEach((file) => {
    formdata.append("old_media[]", file);
  });

  media.forEach((file) => {
    if (typeof file === "string") {
      formdata.append("old_media[]", file);
    } else {
      formdata.append("media[]", file);
    }
  });

  doctor_ids.forEach((id) => {
    formdata.append("doctor_ids[]", id);
  });

  specialization_id.forEach((id) => {
    formdata.append("specialization_id[]", id);
  });

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/hospitals/${id}`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const deleteHospital = async ({ id, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/hospitals/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while deleting the Hospital"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const restoreHospital = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/hospitals/${id}/restore`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while restoring the Hospital"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getTrashedHospitals = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/trashed/hospitals`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
// specializations
export const getSpecializations = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/specializations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getSpecificSpecializations = async ({ token, id }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/specializations/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const newSpecializations = async ({
  token,
  name,
  media,
  hospital_ids = [],
}) => {
  const formdata = new FormData();
  formdata.append("name", name);
  formdata.append("media", media);
  hospital_ids.forEach((id) => {
    formdata.append("hospital_ids[]", id);
  });

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/specializations`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while adding a new Specializations"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const updateSpecializations = async ({
  id,
  token,
  name,
  media,
  _method = "PATCH",
  hospital_ids = [],
}) => {
  const formdata = new FormData();

  formdata.append("name", name);
  formdata.append("media", media);
  formdata.append("_method", _method);

  hospital_ids.forEach((id) => {
    formdata.append(" hospital_ids[]", id);
  });

  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/specializations/${id}`,
      {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating a new Specializations "
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const deleteSpecializations = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/specializations/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while deleting the specializations"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const restorespecializations = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/specializations/${id}/restore`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while restoring the specializations"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getTrashedSpecializations = async ({ token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/trashed/specializations`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};

//states
export const getstates = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/states`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getSpecificState = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/states/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const deleteState = async ({ id, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/states/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while deleting the state"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const updateState = async ({ id, name, _method = "PATCH", token }) => {
  const formdata = new FormData();

  formdata.append("name", name);
  formdata.append("_method", _method);

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/states/${id}`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the state"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const addState = async ({ name, token }) => {
  const formdata = new FormData();

  formdata.append("name", name);

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/states`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the state"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const restoreState = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/states/${id}/restore`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while restoring the specializations"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getTrashedState = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/trashed/states`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};

//cities
export const getcities = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/cities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getCity = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/cities/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const deleteCity = async ({ id, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/cities/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while deleting the city"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const updateCity = async ({
  id,
  name,
  state_id,
  _method = "PATCH",
  token,
}) => {
  const formdata = new FormData();

  formdata.append("name", name);
  formdata.append("state_id", state_id);
  formdata.append("_method", _method);

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/cities/${id}`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the city"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const addCity = async ({ name, token, state_id }) => {
  const formdata = new FormData();

  formdata.append("name", name);
  formdata.append("state_id", state_id);

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/cities`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the city"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const restoreCity = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/cities/${id}/restore`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while restoring the cities"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getTrashedCity = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/trashed/cities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};

//sliders
export const getSliders = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/sliders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getSliderById = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/sliders/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const deleteSliders = async ({ id, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/sliders/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const updateSliders = async ({
  realtable_type,
  realtable_id,
  token,
  media,
  id,
  _method = "PATCH",
}) => {
  const formdata = new FormData();

  formdata.append("realtable_type", realtable_type);
  formdata.append("_method", _method);
  formdata.append("realtable_id", realtable_id);

  if (media && !(typeof media === "string")) {
    formdata.append("media", media);
  }
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/sliders/${id}`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the doctor"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const addSlider = async ({
  realtable_type,
  realtable_id,
  token,
  media,
}) => {
  const formdata = new FormData();

  formdata.append("realtable_type", realtable_type);
  formdata.append("realtable_id", realtable_id);
  if (media && !(typeof media === "string")) {
    formdata.append("media", media);
  }
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/sliders`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while adding the slider"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//xrays
export const getXrays = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/x-rays`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
//common questions

export const getQuestions = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/common-questions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getQuestion = async ({ token, id }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/common-questions/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const deleteQuestion = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/common-questions/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const updateQuestions = async ({
  question,
  answer,
  token,
  id,
  _method = "PATCH",
}) => {
  const formdata = new FormData();
  formdata.append("question", question);
  formdata.append("answer", answer);
  formdata.append("_method", _method);

  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/common-questions/${id}`,
      {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the doctor"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const addQuestion = async ({ question, answer, token }) => {
  const formdata = new FormData();

  formdata.append("question", question);
  formdata.append("answer", answer);
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/common-questions`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while adding the question"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
//recharge card
export const getRechargeCards = async ({
  token,
  page = 1,
  is_valid,
  expire_date,
  card_number,
}) => {
  try {
    const params = new URLSearchParams({ page });

    if (is_valid !== undefined) params.append("is_valid", is_valid);
    if (expire_date) params.append("expire_date", expire_date);
    if (card_number) params.append("card_number", card_number);

    const response = await fetch(
      `${API_URL}/dashboard/v1/recharge?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    throw error;
  }
};
export const addRechargeCards = async ({
  count,
  expire_date,
  price,
  token,
}) => {
  const formdata = new FormData();

  formdata.append("count", count);
  formdata.append("expire_date", expire_date);
  formdata.append("price", price);

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/recharge`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "An error occurred while adding the card"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
//Settings
export const getSettings = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/admin/get-settings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const addSettings = async ({
  points_for_register,
  points_for_review,
  points_for_booking,
  points_value,
  token,
}) => {
  const formdata = new FormData();

  formdata.append("points_for_register", points_for_register);
  formdata.append("points_for_review", points_for_review);
  formdata.append("points_for_booking", points_for_booking);

  for (const [points, value] of Object.entries(points_value)) {
    formdata.append(`points_value[${points}]`, value);
  }

  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/store-settings`,
      {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.msg || "An error occurred while adding settings");
    }
    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getSetting = async ({ token, id }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/get-settings/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const updateSetting = async ({ id, token, ...data }) => {
  const payload = {
    ...data,
    _method: "PATCH",
  };

  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/update-settings/${id}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating settings"
      );
    }
    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
// Coupons API Calls
export const getCoupons = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/coupons`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const UpdateCoupon = async ({
  token,
  code,
  type,
  amount,
  id,
  _method = "PATCH",
}) => {
  const formdata = new FormData();
  formdata.append("_method", _method);
  formdata.append("code", code);
  formdata.append("type", type);
  formdata.append("amount", amount);

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/coupons/${id}`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the Coupon"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const newCoupon = async ({ token, code, type, amount }) => {
  const formdata = new FormData();

  // Required fields
  formdata.append("code", code);
  formdata.append("type", type);
  formdata.append("amount", amount);

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/coupons`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "An error occurred while adding the Coupon"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const deleteCoupon = async ({ id, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/coupons/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
//labs
export const getLabs = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/labs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getTrashedLabs = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/trashed/labs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getSpecificLab = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/labs/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const newLab = async ({
  token,
  name,
  email,
  bio,
  description,
  password,
  active,
  lat,
  long,
  city_id,
  state_id,
  media = [],
  doctor_ids = [],
  specialization_id = [],
}) => {
  const formdata = new FormData();

  formdata.append("name", name);
  formdata.append("email", email);
  formdata.append("bio", bio);
  formdata.append("description", description);
  formdata.append("password", password);
  formdata.append("active", active ? "1" : "0");
  formdata.append("lat", lat);
  formdata.append("long", long);
  formdata.append("city_id", city_id);
  formdata.append("state_id", state_id);

  media.forEach((file) => {
    formdata.append("media[]", file);
  });

  doctor_ids.forEach((id) => {
    formdata.append("doctor_ids[]", id);
  });

  // Append specialization IDs
  specialization_id.forEach((id) => {
    formdata.append("specialization_id[]", id);
  });

  try {
    // Make the request
    const response = await fetch(`${API_URL}/dashboard/v1/labs`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    // Handle errors
    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while adding a new Hospital"
      );
    }

    // Return the response data
    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const updateLab = async ({
  id,
  token,
  name,
  email,
  bio,
  description,
  password,
  active,
  lat,
  long,
  city_id,
  state_id,
  media = [],
  doctor_ids = [],
  specialization_id = [],
}) => {
  const formdata = new FormData();

  formdata.append("name", name);
  formdata.append("email", email);
  formdata.append("bio", bio);
  formdata.append("description", description);
  formdata.append("password", password);
  formdata.append("active", active ? "1" : "0");
  formdata.append("lat", lat);
  formdata.append("long", long);
  formdata.append("city_id", city_id);
  formdata.append("state_id", state_id);

  media.forEach((file) => {
    formdata.append("media[]", file);
  });

  doctor_ids.forEach((id) => {
    formdata.append("doctor_ids[]", id);
  });

  specialization_id.forEach((id) => {
    formdata.append("specialization_id[]", id);
  });

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/labs/${id}`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating  the Hospital"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const deleteLab = async ({ id, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/labs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while deleting the Hospital"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const restoreLab = async ({ id, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/labs/${id}/restore`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while restoring the Hospital"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
// Lab Types
export const getLabTypes = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/lab-types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getSpecificLabType = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/lab-types/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const newLabType = async ({
  token,
  name,
  description,
  active,
  media = [],
}) => {
  const formdata = new FormData();

  formdata.append("name", name);
  formdata.append("description", description);
  formdata.append("media", media);
  formdata.append("active", active ? "1" : "0");

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/lab-types`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while adding a new Lab type"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const updateLabType = async ({
  id,
  token,
  name,
  description,
  media,
  _method = "PATCH",
}) => {
  const formdata = new FormData();

  formdata.append("name", name);
  formdata.append("description", description);
  formdata.append("media", media);
  formdata.append("_method", _method);

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/lab-types/${id}`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while updating the Lab type"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const deleteLabType = async ({ id, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/lab-types/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while deleting the Lab type"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const restoreLabType = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/lab-types/${id}/restore`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while restoring the Lab type"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
// Employee
export const getEmployees = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/employee`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getSpecificEmployee = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/employee/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const newEmployee = async ({
  token,
  name,
  email,
  phone,
  password,
  hospital_id,
  specialization_id,
  active,
  media = "",
}) => {
  const formdata = new FormData();

  // إضافة جميع الحقول المطلوبة إلى FormData
  formdata.append("name", name);
  formdata.append("email", email);
  formdata.append("phone", phone);
  if (password) {
    formdata.append("password", password);
  }
  formdata.append("hospital_id", hospital_id);
  formdata.append("specialization_id", specialization_id);
  formdata.append("active", active ? "1" : "0");

  formdata.append("media", media);

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/employee`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateEmployee = async ({
  id,
  token,
  name,
  email,
  phone,
  password,
  hospital_id,
  specialization_id,
  active,
  media,
}) => {
  const formdata = new FormData();
  if (name) {
    formdata.append("name", name);
  }
  if (email) {
    formdata.append("email", email);
  }
  formdata.append("_method", "patch");
  formdata.append("phone", phone);
  if (password) formdata.append("password", password);
  formdata.append("hospital_id", hospital_id);
  formdata.append("specialization_id", specialization_id);
  formdata.append("active", active ? "1" : "0");

  if (media instanceof File) {
    formdata.append("media", media);
  }

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/employee/${id}`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result.data;
  } catch (error) {
    throw error;
  }
};
export const deleteEmployee = async ({ id, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/employee/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while deleting the Employee"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const restoreEmployee = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/employee/${id}/restore`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while restoring the Employee"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

//services
export const getServices = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/home-visit-service`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const updateService = async ({
  token,
  name,
  _method = "PATCH",
  id,

  type,
}) => {
  const formdata = new FormData();
  formdata.append("name", name);
  formdata.append("type", type);
  formdata.append("_method", _method);

  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/home-visit-service/${id}`,
      {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const deleteService = async ({ id, token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/home-visit-service/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while deleting the service"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getService = async ({ token, id }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/home-visit-service/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const postServices = async ({ token, name, type }) => {
  const formdata = new FormData();
  formdata.append("name", name);
  formdata.append("type", type);

  try {
    const response = await fetch(`${API_URL}/dashboard/v1/home-visit-service`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
//notifcation
export const getNotification = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/notification`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const checkToken = async ({ token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/admin-check-token`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while checking the token"
      );
    }

    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
//refunds
export const getRefundsDetails = async ({
  token,
  doctorname = "",
  hospitalId,
}) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/refund-booking?doctor_name=${doctorname}&hospital_id=${hospitalId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getRefunds = async ({ token, hospitalname }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/refund-one?hospital_name=${hospitalname}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const postRefund = async ({ appointments, token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/cancel-booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ appointments }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.msg || "An error occurred while processing the refund"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
//dashboard
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/get-all-users`, {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getAllHospitals = async () => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/get-all-hospitals`, {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getAllDoctors = async () => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/get-all-doctors`, {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getAllHomeVisit = async () => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/get-all-home-visit-services`,
      {
        method: "GET",
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getStateAndCitiesReport = async ({ token }) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/get-states-with-user-counts`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getReviewsReport = async ({
  token,
  user_id,
  type,
  reviewable_id,
}) => {
  try {
    let url = `${API_URL}/dashboard/v1/get-reviews-report`;
    const params = [];

    if (user_id) {
      params.push(`user_id=${user_id}`);
    }
    if (type) {
      params.push(`reviewable_type=${type}`);
    }
    if (reviewable_id) {
      params.push(`reviewable_id=${reviewable_id}`);
    }

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch reviews report: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    throw new Error(`Error in getReviewsReport: ${error.message}`);
  }
};
export const getCancelledReport = async ({
  token,
  user_id,
  doctor_id,
  hospital_id,
  from_date,
  to_date,
}) => {
  try {
    let url = `${API_URL}/dashboard/v1/get-cancelled-booking-report`;
    const params = [];
    if (user_id) {
      params.push(`user_id=${user_id}`);
    }
    if (doctor_id) {
      params.push(`doctor_id=${doctor_id}`);
    }
    if (hospital_id) {
      params.push(`hospital_id=${hospital_id}`);
    }

    if (from_date) {
      params.push(`from_date=${from_date}`);
    }
    if (to_date) {
      params.push(`to_date=${to_date}`);
    }
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch reviews report: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    throw new Error(`Error in getReviewsReport: ${error.message}`);
  }
};
export const getDocotrReport = async ({
  token,
  doctor_id,
  hospital_id,
  from_date,
  to_date,
}) => {
  try {
    let url = `${API_URL}/dashboard/v1/get-doctor-report`;
    const params = [];

    if (doctor_id) {
      params.push(`doctor_id=${doctor_id}`);
    }
    if (hospital_id) {
      params.push(`hospital_id=${hospital_id}`);
    }
    if (from_date) {
      params.push(`from_date=${from_date}`);
    }
    if (to_date) {
      params.push(`to_date=${to_date}`);
    }
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch reviews report: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    throw new Error(`Error in getReviewsReport: ${error.message}`);
  }
};
export const getHospitalsReport = async ({
  token,
  hospital_id,
  from_date,
  to_date,
}) => {
  try {
    let url = `${API_URL}/dashboard/v1/get-hospital-report`;
    const params = [];

    if (hospital_id) {
      params.push(`hospital_id=${hospital_id}`);
    }
    if (from_date) {
      params.push(`from_date=${from_date}`);
    }
    if (to_date) {
      params.push(`to_date=${to_date}`);
    }
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch reviews report: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    throw new Error(`Error in getReviewsReport: ${error.message}`);
  }
};
export const getGeneralStatistics = async () => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/get-general-statistics`,
      {
        method: "GET",
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getUsersReport = async ({
  token,
  user_id,
  doctor_id,
  hospital_id,
  from_date,
  to_date,
}) => {
  try {
    let url = `${API_URL}/dashboard/v1/get-user-report`;
    const params = [];
    if (user_id) {
      params.push(`user_id=${user_id}`);
    }
    if (doctor_id) {
      params.push(`doctor_id=${doctor_id}`);
    }
    if (hospital_id) {
      params.push(`hospital_id=${hospital_id}`);
    }

    if (from_date) {
      params.push(`from_date=${from_date}`);
    }
    if (to_date) {
      params.push(`to_date=${to_date}`);
    }
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch reviews report: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    throw new Error(`Error in getReviewsReport: ${error.message}`);
  }
};
export const getHomeVisitReport = async ({
  token,
  user_id,
  doctor_id,
  hospital_id,
  from_date,
  to_date,
}) => {
  try {
    let url = `${API_URL}/dashboard/v1/get-home-visit-report`;
    const params = [];
    if (user_id) {
      params.push(`user_id=${user_id}`);
    }
    if (doctor_id) {
      params.push(`doctor_id=${doctor_id}`);
    }
    if (hospital_id) {
      params.push(`hospital_id=${hospital_id}`);
    }

    if (from_date) {
      params.push(`from_date=${from_date}`);
    }
    if (to_date) {
      params.push(`to_date=${to_date}`);
    }
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch reviews report: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    throw new Error(`Error in getReviewsReport: ${error.message}`);
  }
};

//customer service
//customer service
export const getAllCustomerService = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/customer-services`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const updateCustomerService = async ({
  token,
  name,
  phone,
  email,
  is_active,
  password,
  password_confirmation,
  _method = "PATCH",
  id,
}) => {
  const formdata = new FormData();
  formdata.append("name", name);
  formdata.append("email", email);
  formdata.append("phone", phone);
  formdata.append("is_active", is_active);

  if (password) {
    formdata.append("password", password);
  }
  if (password_confirmation) {
    formdata.append("password_confirmation", password_confirmation);
  }
  formdata.append("_method", _method);

  try {
    const response = await fetch(`${API_URL}/customer-services/${id}`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (Array.isArray(result.errors)) {
        console.error("Validation Errors:", result.errors);
        throw new Error(result.errors.join(", "));
      } else {
        throw new Error(
          result.message || "An error occurred while adding the doctor"
        );
      }
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const addCustomerService = async ({
  token,
  name,
  phone,
  email,
  is_active,
  password,
  password_confirmation,
}) => {
  const formdata = new FormData();
  formdata.append("name", name);
  formdata.append("email", email);
  formdata.append("phone", phone);
  formdata.append("is_active", is_active);
  formdata.append("password", password);
  formdata.append("password_confirmation", password_confirmation);
  try {
    const response = await fetch(`${API_URL}/customer-services`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (Array.isArray(result.errors)) {
        console.error("Validation Errors:", result.errors);
        throw new Error(result.errors.join(", "));
      } else {
        throw new Error(
          result.message || "An error occurred while adding the doctor"
        );
      }
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getCustomerService = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/customer-services/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};

//chat
export const getMessages = async ({ token, id }) => {
  try {
    const response = await fetch(`${API_URL}/get-chat-messages/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const postMessage = async ({ user_id, message, token }) => {
  const formdata = new FormData();

  formdata.append("user_id", user_id);
  formdata.append("message", message);

  try {
    const response = await fetch(
      `${API_URL}/dashboard/v1/admin/admin-message`,
      {
        method: "POST",
        body: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.msg || "An error occurred while adding settings");
    }
    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getUsers = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/customer-get-chats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const getRequestForm = async ({ token }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/admin/requestform`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    throw error;
  }
};
export const closeChat = async ({ token, chat_id,subject }) => {
  const formdata = new FormData();
  formdata.append("subject", subject);
  formdata.append("chat_id", chat_id,);

  try {
    const response = await fetch(`${API_URL}/close-chat`, {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const getHospitalsByspecialization = async ({ token ,id=1 }) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/v1/get-hospitals-by-specialization/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data?.data;
    }
  } catch (error) {
    throw error;
  }
};