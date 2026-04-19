"use client";

import { useState } from "react";
import ApplyModal from "@/components/ApplyModal";

interface Opening {
  id: number;
  title: string;
  location: string;
  position: string;
  modeOfWork: string;
  experience: string;
}

interface Props {
  openings: Opening[];
}

export default function CareerOpenings({ openings }: Props) {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  return (
    <>
      <div className="career-jobs-list">
        {openings.map((job) => (
          <div className="job-item" key={job.id}>
            <div className="job-item-left">
              <h3>
                {job.title} <i className="fas fa-arrow-right"></i>
              </h3>
              <p className="job-location">{job.location}</p>
            </div>
            <div className="job-item-right">
              <div className="job-detail">
                <i className="fas fa-briefcase"></i>
                <span>{job.position}</span>
              </div>
              <div className="job-detail">
                <i className="fas fa-clock"></i>
                <span>{job.modeOfWork}</span>
              </div>
              <div className="job-detail">
                <i className="fas fa-star"></i>
                <span>{job.experience}</span>
              </div>
              <button
                className="btn-apply"
                onClick={() => setSelectedJob(job.title)}
              >
                Apply Now <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedJob && (
        <ApplyModal
          jobTitle={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </>
  );
}
