const Joi = require("@hapi/joi");
const Test = require("../../controllers/Test");

const router = [
  {
    path: "/add",
    method: "POST",
    options: {
      handler: Test.addDetails,
      description: "Add details",
      notes: "Add and see the output",
      tags: ["api"],
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email().required(),
          password: Joi.string().required(),
        }),
      },
    },
  },
  {
    path: "/show-all-details",
    method: "GET",
    options: {
      handler: Test.showAllDetails,
      description: "Show details",
      notes: "show all the details",
      tags: ["api"],
    },
  },
  {
    path: "/show-single-detail/{id}",
    method: "GET",
    options: {
      handler: Test.showSingleDetail,
      description: "Show single details",
      notes: "show single detail",
      tags: ["api"],
      validate: {
        params: Joi.object({
          id: Joi.number().required(),
        }),
      },
    },
  },
  {
    path: "/update",
    method: "PUT",
    options: {
      handler: Test.update,
      description: "Update details",
      notes: "update details",
      tags: ["api"],
      validate: {
        payload: Joi.object({
          id: Joi.number().required(),
          name: Joi.string().required(),
          email: Joi.string().email().required(),
        }),
      },
    },
  },
  {
    path: "/file-upload",
    method: "POST",
    options: {
      payload: {
        output: "file",
        multipart: true,
      },
      handler: Test.fileUpload,
      description: "File upload",
      notes: "upload the files",
      tags: ["api"],
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
        },
      },
      validate: {
        payload: Joi.object({
          file: Joi.any().meta({ swaggerType: "file" }).description("file"),
        }),
      },
    },
  },
];

module.exports = router;
