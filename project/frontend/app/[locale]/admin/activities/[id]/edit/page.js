"use client";
import { useParams } from "next/navigation";
import ActivityEditor from "../../ActivityEditor";

export default function EditActivityPage() {
  const { id } = useParams();
  return <ActivityEditor activityId={id} />;
}
