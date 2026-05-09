import { ChatMessage } from '../entities'

/**
 * @swagger
 * components:
 *   schemas:
 *     ChatMessageResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "message-123"
 *         threadId:
 *           type: string
 *           example: "thread-123"
 *         sender:
 *           type: string
 *           enum: ["user", "ai"]
 *           example: "user"
 *         message:
 *           type: string
 *           example: "Hello, how can I help you?"
 *         searchStatus:
 *           type: string
 *           enum: [incomplete_details, awaiting_confirmation, ready_for_search, cancelled, not_a_search_request]
 *           description: "<ul><li>incomplete_details: The user has not provided all the necessary details to start the search.</li>
 *                         <li>awaiting_confirmation: The user has provided all the necessary details, but needs to confirm them.</li>
 *                         <li>ready_for_search: The user has confirmed the details and is ready to start the search.</li>
 *                         <li>cancelled: The user has explicitly cancelled the search.</li>
 *                         <li>not_a_search_request: The user's input is unrelated to a search request.</li></ul>"
 *         context:
 *           type: object
 *           properties:
 *             certifications:
 *               type: array
 *               items:
 *                 type: string
 *             specifications:
 *               type: array
 *               items:
 *                 type: string
 *             marketRegion:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export class ChatPresenter {
  static messageToView(chatMessage: ChatMessage): ChatMessage {
    return {
      id: chatMessage.id,
      threadId: chatMessage.threadId,
      sender: chatMessage.sender,
      message: chatMessage.message,
      searchStatus: chatMessage.searchStatus,
      context: chatMessage.context,
      createdAt: chatMessage.createdAt,
      updatedAt: chatMessage.updatedAt,
    }
  }

  static messagesToListView(chatMessages: ChatMessage[]): ChatMessage[] {
    return chatMessages
      .filter((chatMessage) => !!chatMessage)
      .map((chatMessage) => ChatPresenter.messageToView(chatMessage))
  }
}
