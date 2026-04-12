/**
 * @typedef {Object} IUser
 * @property {string} [ _id ]
 * @property {string} name
 * @property {string} email
 * @property {string} [ password ]
 * @property {string} [ avatar ]
 * @property {Date} [ createdAt ]
 * @property {Date} [ updatedAt ]
 */

/**
 * @typedef {Object} IMessage
 * @property {string} [ _id ]
 * @property {string} chatId
 * @property {string} senderId
 * @property {string} content
 * @property {boolean} isAI
 * @property {Date} [ createdAt ]
 * @property {Date} [ updatedAt ]
 */

/**
 * @typedef {Object} IChat
 * @property {string} [ _id ]
 * @property {string[]} participants
 * @property {IMessage} [ lastMessage ]
 * @property {boolean} aiModeEnabled
 * @property {number} unreadCount
 * @property {Date} [ createdAt ]
 * @property {Date} [ updatedAt ]
 */

/**
 * @typedef {Object} JwtPayload
 * @property {string} userId
 * @property {string} email
 */