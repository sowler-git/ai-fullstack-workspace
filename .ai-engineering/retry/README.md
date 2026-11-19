# Retry queue

Each retry record keeps its original `eventId`, failure reason, next-attempt time, and incremented `attempt`. A retry must never delete the original pending event before a successful archival receipt exists.
