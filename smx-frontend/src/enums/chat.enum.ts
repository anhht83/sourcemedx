export enum EAiSearchRequestStatus {
  incomplete_details = 'incomplete_details',
  awaiting_confirmation = 'awaiting_confirmation',
  ready_for_search = 'ready_for_search',
  cancelled = 'cancelled',
  not_a_search_request = 'not_a_search_request',
}

export enum ESearchStatus {
  not_ready = 'not_ready',
  incomplete_details = EAiSearchRequestStatus.incomplete_details,
  awaiting_confirmation = EAiSearchRequestStatus.awaiting_confirmation,
  searching = 'searching',
  cancelled = EAiSearchRequestStatus.cancelled,
  completed_search = 'completed_search',
  failed_search = 'failed_search',
}

export enum ESender {
  USER = 'user',
  AI = 'ai',
}
