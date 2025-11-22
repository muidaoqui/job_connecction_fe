export default function JobCard({ job }) {
  return (
    <div
      onClick={() => (window.location.href = `/jobs/${job._id}`)}
      className="p-5 bg-white rounded-xl shadow hover:shadow-xl cursor-pointer transition-all hover:-translate-y-1"
    >
      <h2 className="text-xl font-bold text-slate-800">{job.title}</h2>
      <p className="text-slate-500">{job.location}</p>
      <p className="text-green-600 font-semibold">{job.salary || "Thoả thuận"}</p>

      <p className="text-slate-600 mt-2 line-clamp-3">{job.description}</p>

      <div className="flex gap-3 mt-3">
        <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
          {job.jobType || "Full time"}
        </span>
        <span className="bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm">
          {job.location || "Không rõ"}
        </span>
      </div>
    </div>
  );
}
