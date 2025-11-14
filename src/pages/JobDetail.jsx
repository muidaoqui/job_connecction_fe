import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "../services/jobService";

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    getJobById(id)
      .then((res) => setJob(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!job) return <p>Đang tải...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>

      <p><b>Mô tả:</b> {job.description}</p>
      <p><b>Yêu cầu:</b> {job.requirements}</p>
      <p><b>Lương:</b> {job.salary}</p>
      <p><b>Địa điểm:</b> {job.location}</p>
      <p><b>Loại hình:</b> {job.jobType}</p>
    </div>
  );
};

export default JobDetail;
