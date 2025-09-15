const axios = require("axios");

const BACKEND_URL = "http://localhost:4000";
const WS_URL = "ws://localhost:4001";

/*
  ^^^^^HTTP Tests^^^^^
*/
describe("Authentication", () => {
  test("User is able to signup only once", async () => {
    const username = "shyam" + Math.random();
    const password = "akjdfbawekfbef";
    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "user",
    });

    expect(response.statusCode).toBe(201);
    expect(response.data.userId).toBeDefined();

    const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "user",
    });

    expect(updatedResponse.statusCode).toBe(400);
  });

  test("Signup fails if the username is empty", async () => {
    const username = "shyam" + Math.random();
    const password = "wkejfbwe";
    const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      password,
      type: "user",
    });

    expect(response.statusCode).toBe(400);
  });

  test("User is able to signin if username and password is correct", async () => {
    const username = "shyam-" + Math.random();
    const password = "iwufbwksf";

    await axios.post(`${BACKEND_URL}/api/v1/sigup`, {
      username,
      password,
    });

    const response = axios.post(`${BACKEND_URL}/api/v1/sigin`, {
      username,
      password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.data.token).toBeDefined();
  });

  test("Signin fails with wrong password", async () => {
    const username = "shyam-" + Math.random();
    const password = "adcjhbwiedb";

    await axios.post(`${BACKEND_URL}/api/v1/sigup`, {
      username,
      password,
    });

    const response = axios.post(`${BACKEND_URL}/api/v1/sigin`, {
      username,
      password: "skjbfkewjbf",
    });

    expect(response.statusCode).toBe(403);
  });

  test("Signin fails with unregistered/invalid username", async () => {
    const username = "shyam-" + Math.random();
    const password = "adcjhbwiedb";

    await axios.post(`${BACKEND_URL}/api/v1/sigup`, {
      username,
      password,
    });

    const response = axios.post(`${BACKEND_URL}/api/v1/sigin`, {
      username: "shyam---123456",
      password: "skjbfkewjbf",
    });

    expect(response.statusCode).toBe(403);
  });
});

describe("User Metadata Endpoints", () => {
  let token: string;
  let avatarId: string;
  beforeAll(async () => {
    const username = "shyam" + Math.random();
    const password = "skdjbvfsjkfb";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
      type: "user",
    });

    token = response.data.token;

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://img.itch.zone/aW1hZ2UvNTg2NzU3LzMwOTQ5MzIucG5n/794x1000/zBNE8T.png",
        name: "Purple",
      },
      {
        authorization: `Bearer ${token}`,
      }
    );

    avatarId = avatarResponse.data.avatarId;
  });

  test("User can't update their metadata with a wrong avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId: "1234554321234",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.statusCode).toBe(400);
  });

  test("User can update their metadata with correct avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.statusCode).toBe(200);
  });

  test("User can't update metadata without auth header'", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId,
    });

    expect(response.statusCode).toBe(403);
  });
});

describe("User Avatar Information", () => {
  let token: string;
  let avatarId: string;
  let userId: string;
  beforeAll(async () => {
    const username = "shyam" + Math.random();
    const password = "skdjbvfsjkfb";

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });

    userId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
      type: "user",
    });

    token = response.data.token;

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl:
          "https://img.itch.zone/aW1hZ2UvNTg2NzU3LzMwOTQ5MzIucG5n/794x1000/zBNE8T.png",
        name: "Purple",
      }
    );

    avatarId = avatarResponse.data.avatarId;
  });

  test("Get back avatar information for a user", async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`
    );

    expect(response.data.avatars.length).toBe(1);
    expect(response.data.avatars[0].userId).toBe(userId);
  });

  test("Available avatars", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);

    expect(response.data.avatars.length).not.toBe(0);
    const currentAvatar = response.data.avatars.find(
      (x: { id: string }) => x.id == avatarId
    );
    expect(currentAvatar).toBeDefined();
  });
});

describe("Space Dashboard Endpoints", () => {
  let userId: string;
  let token: string;
  let spaceId: string;
  let mapId: string;
  let element1Id: string;
  let element2Id: string;
  let adminUserId: string;
  let adminToken: string;

  beforeAll(async () => {
    const username = "shyam-" + Math.random();
    const password = "ygubhnjwd5.";

    let signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    adminUserId = signupResponse.data.userId;

    const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
    });
    adminToken = signinResponse.data.token;

    const element1 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://img.itch.zone/aW1hZ2UvNTg2NzU3LzMwOTQ5MzIucG5n/794x1000/zBNE8T.png",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    element1Id = element1.data.id;

    const element2 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://img.itch.zone/aW1hZ2UvNTg2NzU3LzMwOTQ5MzIucG5n/794x1000/zBNE8T.png",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    element2Id = element2.data.id;

    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/1.jpg",
        dimensions: "100x200",
        name: "Meeting room",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 18,
            y: 20,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    mapId = mapResponse.data.id;

    const userSignUp = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username: username + "5tyhjnm",
      password,
      type: "user",
    });
    userId = userSignUp.data.userId;

    const userSignin = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username: username + "5tyhjnm",
      password,
    });
    token = userSignin.data.token;
  });

  test("User is able to create space", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Space1",
        dimensions: "100x200",
        mapId,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.statusCode).toBe(200);
    expect(response.data.spaceId).toBeDefined();
  });

  test("User is able to create space without valid map id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Space1",
        dimensions: "100x200",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.statusCode).toBe(200);
  });

  test("User is not able to create space without valid dimensions or mapId", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Space1",
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.statusCode).toBe(400);
  });

  //   Delete a space
  test("User is able to delete a space", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Space1",
        dimensions: "100x200",
        mapId,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    const spaceId = response.data.spaceId;

    const deleteResponse = await axios.delete(
      `${BACKEND_URL}/api/v1/space/:${spaceId}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    expect(deleteResponse.statusCode).toBe(200);
  });

  test("User can't delete a space that doesn't exist", async () => {
    const response = await axios.delete(`${BACKEND_URL}/api/v1/space/:67890`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(400);
  });

  test("User should not be able to delete other user's space", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Space1",
        dimensions: "100x200",
        mapId,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    const spaceId = response.data.spaceId;

    const deleteResponse = await axios.delete(
      `${BACKEND_URL}/api/v1/space/:${spaceId}`,
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    expect(deleteResponse.statusCode).toBe(400);
  });

  //   Get all existing spaces
  test("User can get/see all his existing spaces", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.data.spaces).toBeDefined();
  });

  test("Admin has no spaces initially", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.data.spaces.length).toBe(0);
  });

  test("Admin has 1 space", async () => {
    const createSpaceResponse = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Space1",
        dimensions: "100x200",
        mapId,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const filteredSpace = response.data.spaces.find(
      (x: { id: string }) => x.id == createSpaceResponse.response.spaceId
    );
    expect(response.data.spaceId.length).toBe(1);
    expect(filteredSpace).toBeDefined();
    expect(filteredSpace == createSpaceResponse.response.spaceId);
  });
});

describe("Arena Endpoints", () => {
  let userId: string;
  let userToken: string;
  let spaceId: string;
  let mapId: string;
  let element1Id: string;
  let element2Id: string;
  let adminUserId: string;
  let adminToken: string;

  beforeAll(async () => {
    const username = "shyam-" + Math.random();
    const password = "ygubhnjwd5.";

    let signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    adminUserId = signupResponse.data.userId;

    const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
    });

    adminToken = signinResponse.data.token;

    const element1 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://img.itch.zone/aW1hZ2UvNTg2NzU3LzMwOTQ5MzIucG5n/794x1000/zBNE8T.png",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    element1Id = element1.data.id;

    const element2 = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://img.itch.zone/aW1hZ2UvNTg2NzU3LzMwOTQ5MzIucG5n/794x1000/zBNE8T.png",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    element2Id = element2.data.id;

    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/1.jpg",
        dimensions: "100x200",
        name: "Meeting room",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 18,
            y: 20,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    mapId = mapResponse.data.id;

    const userSignUp = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username: username + "jh678k",
      password,
      type: "user",
    });
    userId = userSignUp.data.userId;

    const userSignin = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username: username + "jh678k",
      password,
    });
    userToken = userSignin.data.token;

	const spaceCreateResponse = await axios(`${BACKEND_URL}/api/v1/space`, {
		"name": "Test",
		"dimensions": "100x200",
		"mapId": mapId
	}, {
		headers: {
			authorization: `Bearer ${userToken}`
		}
	})

	spaceId = spaceCreateResponse.data.spaceId
  });

  test("Incorrect spaceId returns 400", async() => {
	const response = await axios.get(`${BACKEND_URL}/api/v1/space/:3535gx36`,{
		headers: {
			authorization: `Bearer ${userToken}`
		}
	})

	expect(response.statusCode).toBe(400)
  })

  test("Correct spaceId returns all the elements", async() => {
	const response = await axios.get(`${BACKEND_URL}/api/v1/space/:${spaceId}`,{
		headers: {
			authorization: `Bearer ${userToken}`
		}
	})

	expect(response.statusCode).toBe(200)
	expect(response.data.dimensions).toBe("100x200")
	expect(response.data.elements.length).toBe(2)
  })

  test("Delete endpoint is able to delete an element", async() => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/:${spaceId}`, {
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })
    
    await axios.delete(`${BACKEND_URL}/api/v1/space/element`,{
      "id": response.data.elements[0].id
    },{
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })

    const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/:${spaceId}`, {
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })

	expect(newResponse.data.elements.length).toBe(1)
  })

  test("Able to add an element in the space", async () => {
    const addElementResponse = await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
        "elementId": element1Id,
        "spaceId": spaceId,
        "x": 50,
        "y": 20
      }, {
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })

    const response = await axios.get(`${BACKEND_URL}/api/v1/space/:${spaceId}`, {
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })

    expect(addElementResponse.statusCode).toBe(200)
    expect(response.data.elements.length(2))
  })

  test("Adding element fails fails if position lies outside the dimension", async () => {
    const addElementResponse = await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
        "elementId": element1Id,
        "spaceId": spaceId,
        "x": 50120,
        "y": 2000
      }, {
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })

    expect(addElementResponse.statusCode).toBe(400)
  })

  test("Not able to add an element in the space with invalid element id", async () => {
    const addElementResponse = await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
        "spaceId": spaceId,
        "x": 50,
        "y": 20
      }, {
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })

    expect(addElementResponse.statusCode).toBe(400)
  })

  test("Not able to add an element in the space with invalid space id", async () => {
    const addElementResponse = await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
        "elementId": element1Id,
        "x": 50,
        "y": 20
      }, {
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })

    expect(addElementResponse.statusCode).toBe(400)
  })
});

describe("Admin Endpoints", () => {
  let userId: string;
  let userToken: string;
  let adminUserId: string;
  let adminToken: string;

  beforeAll(async () => {
    const username = "shyam-" + Math.random();
    const password = "ygubhnjwd5.";

    let signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    adminUserId = signupResponse.data.userId;

    const signinResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
    });
    adminToken = signinResponse.data.token;

    const userSignUp = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username: username + "jh678k",
      password,
      type: "user",
    });
    userId = userSignUp.data.userId;

    const userSignin = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username: username + "jh678k",
      password,
    });
    userToken = userSignin.data.token;

  });

  test("User is not able to hit admin endpoints", async() => {
    const createElementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
      "imageUrl": "https://img.itch.zone/aW1hZ2UvNTg2NzU3LzMwOTQ5MzIucG5n/794x1000/zBNE8T.png",
      "width": 1,
      "height": 1,
      "static": true
    },{
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })

    const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/:elementId`, {
      "imageUrl": "https://img.itch.zone/aW1hZ2UvNTg2NzU3LzMwOTQ5MzIucG5n/794x1000/zBNE8T.png"	
    },{
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })

    const createAvatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
	    "name": "Timmy"
    },{
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })

    const createMapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
      "thumbnail": "https://thumbnail.com/a.png",
      "dimensions": "100x200",
      "name": "100 person interview room",
      "defaultElements": []
    }, {
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })

    expect(createElementResponse.statusCode).toBe(403)
    expect(updateElementResponse.statusCode).toBe(403)
    expect(createAvatarResponse.statusCode).toBe(403)
    expect(createMapResponse.statusCode).toBe(403)

  })

  test("Admin is able to hit admin endpoints", async() => {
    const createElementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
      "imageUrl": "https://img.itch.zone/aW1hZ2UvNTg2NzU3LzMwOTQ5MzIucG5n/794x1000/zBNE8T.png",
      "width": 1,
      "height": 1,
      "static": true
    },{
      headers: {
        authorization: `Bearer ${adminToken}`
      }
    })

    const createAvatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
	    "name": "Timmy"
    },{
      headers: {
        authorization: `Bearer ${adminToken}`
      }
    })

    const createMapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
      "thumbnail": "https://thumbnail.com/a.png",
      "dimensions": "100x200",
      "name": "100 person interview room",
      "defaultElements": []
    }, {
      headers: {
        authorization: `Bearer ${adminToken}`
      }
    })

    expect(createElementResponse.statusCode).toBe(403)
    expect(createAvatarResponse.statusCode).toBe(403)
    expect(createMapResponse.statusCode).toBe(403)

  })

  test("Admin is able to update the element(imageUrl)", async() => {
    const createElementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
      "imageUrl": "https://img.itch.zone/aW1hZ2UvNTg2NzU3LzMwOTQ5MzIucG5n/794x1000/zBNE8T.png",
      "width": 1,
      "height": 1,
      "static": true
    },{
      headers: {
        authorization: `Bearer ${adminToken}`
      }
    })

    const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/:${createElementResponse.data.id}`, {
      "imageUrl": "https://img.itch.zone/aW1hZ2UvNTg2NzU3LzMwOTQ5MzIucG5n/794x1000/zBNE8T.png"	
    },{
      headers: {
        authorization: `Bearer ${adminToken}`
      }
    })

    expect(updateElementResponse.statusCode).toBe(200)

  })
})

/*
  ^^^^^WebSocket Tests^^^^^
*/
describe('Websocket Tests', () => { 
  let adminUserId: string
  let userId: string
  let adminToken: string
  let userToken: string
  let mapId: string
  let spaceId: string
  let ws1: WebSocket
  let ws2: WebSocket
  let userX: number
  let userY: number
  let adminX: number
  let adminY: number

  interface WsMessage {
    type: string,
    payload: Record<string, any>
  }

  let ws1Messages: Array<WsMessage> = []
  let ws2Messages: Array<WsMessage> = []

  async function waitAndPopLatestMessages(messagesArray:Array<WsMessage>): Promise<WsMessage> {
    return new Promise(resolve => {
      if(messagesArray.length > 0){
         resolve(messagesArray.shift()!)
      }else{
        let interval = setTimeout(() => {
          if(messagesArray.length > 0){
            resolve(messagesArray.shift()!)
            clearInterval(interval)
          }
        }, 100)
      }
    })
  }

  async function setupHTTP() {
    const username = "shyam-" + Math.random();
    const password = "ygubhnjwd5.";

    let adminSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin",
    });
    adminUserId = adminSignupResponse.data.userId;

    const adminSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
    });
    adminToken = adminSigninResponse.data.token;

    const userSignup = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username: username + "qwerty",
      password,
      type: "user",
    });
    userId = userSignup.data.userId;

    const userSignin = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username: username + "qwerty",
      password,
    });
    userToken = userSignin.data.token;

    const element1Response = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://img.itch.zone/aW1hZ2UvNTg2NzU3LzMwOTQ5MzIucG5n/794x1000/zBNE8T.png",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    const element1Id = element1Response.data.id;

    const element2Response = await axios.post(
      `${BACKEND_URL}/api/v1/admin/element`,
      {
        imageUrl:
          "https://img.itch.zone/aW1hZ2UvNTg2NzU3LzMwOTQ5MzIucG5n/794x1000/zBNE8T.png",
        width: 1,
        height: 1,
        static: true,
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    const element2Id = element2Response.data.id;

    const mapResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/1.jpg",
        dimensions: "100x200",
        name: "Meeting room",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 18,
            y: 20,
          },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      }
    );
    mapId = mapResponse.data.id;
    
    const spaceCreateResponse = await axios(`${BACKEND_URL}/api/v1/space`, {
      "name": "Test",
      "dimensions": "100x200",
      "mapId": mapId
    }, {
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })
    spaceId = spaceCreateResponse.data.spaceId
  }

  async function setupWS() {
    // Connect User1
    ws1 = new WebSocket(WS_URL)
    
    await new Promise(r => {
      ws1.onopen = r
    })

    ws1.onmessage = (event) => {
      ws1Messages.push(JSON.parse(event.data))
    }

    // Connect User2
    ws2 = new WebSocket(WS_URL)

    await new Promise(r => {
      ws2.onopen = r
    })

    ws2.onmessage = (event) => {
      ws2Messages.push(JSON.parse(event.data))
    }
  }

  beforeAll(async() => {
    setupHTTP()
    setupWS()
  })

  test("Get back acknowledgement for joining the space", async() => {
    ws1.send(JSON.stringify({
        "type": "join",
        "payload": {
          "spaceId": spaceId,
          "token": userToken
        }
    }))
    const message1 = await waitAndPopLatestMessages(ws1Messages)

    ws2.send(JSON.stringify({
        "type": "join",
        "payload": {
          "spaceId": spaceId,
          "token": adminToken
        }
    }))

    const message2 = await waitAndPopLatestMessages(ws2Messages)
    const message3 = await waitAndPopLatestMessages(ws1Messages)

    expect(message1.type).toBe("space-joined")
    expect(message2.type).toBe("space-joined")

    expect(message1.payload.users.lengt).toBe(0)
    expect(message2.payload.users.lengt).toBe(1)
    expect(message3.type).toBe("user-join")
    expect(message3.payload.x).toBe(message2.payload.spawn.x)
    expect(message3.payload.y).toBe(message2.payload.spawn.y)
    expect(message3.payload.userId).toBe(message2.payload.userId)
    

    userX = message1.payload.spawn.x
    userY = message1.payload.spawn.y
    adminX = message2.payload.spawn.x
    adminY = message2.payload.spawn.y
  })

  test("User should not be able to across the boundry of the wall", async() => {
    ws1.send(JSON.stringify({
      type: "movement",
      payload: {
        x: 12345,
        y: 10000
      }
    }))

    const message = await waitAndPopLatestMessages(ws1Messages)
    expect(message.type).toBe("movement-rejected")
    expect(message.payload.x).toBe(userX)
    expect(message.payload.y).toBe(userY)
  })

  test("User should not be able jump 2 blocks at once", async() => {
    ws1.send(JSON.stringify({
      type: "movement",
      payload: {
        x: userX + 2,
        y: userY
      }
    }))

    const message = await waitAndPopLatestMessages(ws1Messages)
    expect(message.type).toBe("movement-rejected")
    expect(message.payload.x).toBe(userX)
    expect(message.payload.y).toBe(userY)
  })

  test("User should not be able jump 2 blocks at once", async() => {
    ws1.send(JSON.stringify({
      type: "movement",
      payload: {
        x: userX,
        y: userY + 2
      }
    }))

    const message = await waitAndPopLatestMessages(ws1Messages)
    expect(message.type).toBe("movement-rejected")
    expect(message.payload.x).toBe(userX)
    expect(message.payload.y).toBe(userY)
  })

  test("Correct movement should be broadcasted to the other users in the room", async() => {
    ws1.send(JSON.stringify({
      type: "movement",
      payload: {
        x: userX + 1,
        y: userY,
        userId: userId
      }
    }))

    const message = await waitAndPopLatestMessages(ws2Messages)
    expect(message.type).toBe("movement")
    expect(message.payload.x).toBe(userX + 1)
    expect(message.payload.y).toBe(userY)
  })

  test("If a user leaves, other users receive the leave event", async() => {
    ws1.close()

    const message = await waitAndPopLatestMessages(ws2Messages)
    expect(message.type).toBe("user-left")
    expect(message.payload.userId).toBe(userId)
  })
 })