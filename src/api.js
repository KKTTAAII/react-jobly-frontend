import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class JoblyApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { authorization: `Bearer ${this.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  //Get all info - companies, jobs, users
  static async getAll(type, data, token) {
    this.token = token.token;
    const res = await this.request(`${type}/`, data);
    return res[type];
  }

  //Get individual info - companies:handle, jobs:id, users:username
  static async getSingleInfo(type, params, token) {
    this.token = token.token;
    const res = await this.request(`${type}/${params}`);
    if (type === "companies") {
      return res.company;
    } else if (type === "jobs") {
      return res.job;
    } else if (type === "users") {
      return res.user;
    }
  }

  //Delete individual info - companies:handle, jobs:id, users:username
  static async deleteSingleInfo(type, params) {
    const res = await this.request(`${type}/${params}`, {}, "delete");
    return res;
  }

  //Add individual info - companies, jobs, users
  static async addInfo(type, data) {
    const res = await this.request(`${type}/`, data, "post");
    if (type === "companies") {
      return res.company;
    } else if (type === "jobs") {
      return res.job;
    } else if (type === "users") {
      return res.user;
    }
  }

  //Update individual info - companies:handle, jobs:id, users:username
  static async updateInfo(type, params, data, token) {
    this.token = token.token;
    const res = await this.request(`${type}/${params}`, data, "patch");
    if (type === "companies") {
      return res.company;
    } else if (type === "jobs") {
      return res.job;
    } else if (type === "users") {
      return res.user;
    }
  }

  //JOBS route

  /**Applied for a job */
  static async appliedJob(username, id, token) {
    this.token = token.token;
    const res = await this.request(`users/${username}/jobs/${id}`, {}, "post");
    return res;
  }

  //AUTH route

  /**Authenticate for Log in */
  static async authenticate(data) {
    const res = await this.request(`auth/token`, data, "post");
    return res;
  }

  /**Sign up */
  static async signUp(data) {
    const res = await this.request(`auth/register`, data, "post");
    return res;
  }
}

export default JoblyApi;
