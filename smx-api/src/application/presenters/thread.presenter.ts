import { ChatThread } from '../entities'

/**
 * @swagger
 * components:
 *   schemas:
 *     ChatThreadResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "thread-123"
 *         title:
 *           type: string
 *           example: "Search for a product"
 *         searchStatus:
 *           type: string
 *           enum: [not_ready, incomplete_details, awaiting_confirmation, searching, cancelled, completed_search, failed_search]
 *           description: "<ul><li>not_ready: The search has not started yet.</li>
 *                         <li>incomplete_details: The user has not provided all the necessary details to start the search.</li>
 *                         <li>awaiting_confirmation: The user has provided all the necessary details, but needs to confirm them.</li>
 *                         <li>searching: The user has confirmed the details and is ready to start the search.</li>
 *                         <li>cancelled: The user has explicitly cancelled the search.</li>
 *                         <li>completed_search: The search has completed successfully.</li>
 *                         <li>failed_search: The search has failed.</li></ul>"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export class ThreadPresenter {
  static threadToView(
    thread: ChatThread,
  ): Omit<ChatThread, 'messages' | 'userId' | 'user' | 'context'> {
    return {
      id: thread.id,
      title: thread.title,
      searchStatus: thread.searchStatus,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
    }
  }

  static threadsToListView(
    threads: ChatThread[],
  ): Omit<ChatThread, 'messages' | 'userId' | 'user' | 'context'>[] {
    return threads.map((thread) => ThreadPresenter.threadToView(thread))
  }

  static threadWithRelationsToView(thread: ChatThread): ChatThread {
    const messages = thread.messages
    messages.sort((a, b) => {
      return a.createdAt && b.createdAt
        ? a.createdAt.getTime() - b.createdAt.getTime()
        : 0
    })
    return {
      id: thread.id,
      userId: thread.userId,
      title: thread.title,
      searchStatus: thread.searchStatus,
      context: thread.context,
      reports: thread.reports,
      messages,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
    }
  }
}
