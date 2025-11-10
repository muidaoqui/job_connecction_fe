import React from "react";
import Slider from "react-slick";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { j1, j2, j3, j4, j5 } from "../../assets/jobs";
import { l1, l2, l3, l4, l5, l6} from "../../assets/jobslogo";

// Nút mũi tên trái
function PrevArrow(props) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-0 z-10 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 top-1/2 -translate-y-1/2"
    >
      <MdKeyboardArrowLeft size={30} />
    </button>
  );
}

// Nút mũi tên phải
function NextArrow(props) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-0 z-10 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 top-1/2 -translate-y-1/2"
    >
      <MdKeyboardArrowRight size={30} />
    </button>
  );
}

// Cấu hình slider
const sliderSettings = {
  dots: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  speed: 600,
  slidesToShow: 1,
  slidesToScroll: 1,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,
};

function Home() {
  // Danh sách ảnh cần hiển thị
  const jobImages = [j1, j2, j3, j4, j5];

  return (
    <div className="w-full ">
      <div className="w-full my-4 relative">
        <Slider {...sliderSettings}>
          {jobImages.map((img, idx) => (
            <div key={idx} className="px-2">
              <img
                src={img}
                alt={`job-${idx + 1}`}
                className="w-full h-[400px] object-cover rounded-2xl shadow-md"
              />
              <div className="flex justify-between my-4 h-16">
                <p>Job Title</p>
                <button className=" bg-white p-4">Apply Now</button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <div className="bg-gradient-to-b from-white to-blue-100 my-4 px-10">
        <h1 className="text-3xl text-blue-600 font-bold ml-10">NHÀ TUYỂN DỤNG NỔI BẬT</h1>
        <div className="flex gap-4 justify-around my-6 py-4">
            <button>
                <img src={l1} alt="logo-1" className=" h-16 object-contain" />
            </button>
            <button>
                <img src={l2} alt="logo-2" className=" h-16 object-contain" />
            </button>
            <button>
                <img src={l3} alt="logo-3" className=" h-16 object-contain" />
                
            </button>
            <button>
                <img src={l4} alt="logo-4" className=" h-16 object-contain" />
            </button>
            <button>
                <img src={l5} alt="logo-5" className=" h-16 object-contain" />
            </button>
            <button>
                <img src={l6} alt="logo-6" className=" h-16 object-contain" />
            </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 my-4 px-10 min-h-screen">
        <h1 className="text-3xl text-blue-600 font-bold ml-10">
            CÔNG VIỆC HOT HÔM NAY
        </h1>
        <p className="ml-10 ">
            Công việc tốt nhất đến từ những nhà tuyển dụng hàng đầu.
        </p>
        <div>
            {/* Thêm nội dung công việc hot ở đây */}
            SAU NÀY SẼ GỌI API HIỂN THỊ CÔNG VIỆC HOT
        </div>
      </div>
      <div className="flex flex-col gap-2 my-4 px-10 min-h-screen">
        <h1 className="text-3xl text-blue-600 font-bold ml-10">
            CÔNG TY NỔI BẬT
        </h1>
        <div>
            {/* Thêm nội dung công ty nổi bật ở đây */}
            SAU NÀY SẼ GỌI API HIỂN THỊ CÔNG TY NỔI BẬT
        </div>
      </div>
      <div className="flex flex-col gap-2 my-4 px-10 bg-blue-100 min-h-screen py-10">
        <h1 className="text-3xl text-blue-600 font-bold ml-10">
            CÁC CÔNG TY PHỔ BIẾN
        </h1>
        <div>
            {/* Thêm nội dung công ty phổ biến ở đây */}
            SAU NÀY SẼ GỌI API HIỂN THỊ CÔNG TY PHỔ BIẾN
        </div>
      </div>
      
    </div>
  );
}

export default Home;