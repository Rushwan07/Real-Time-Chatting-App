import React from "react";
import MessegeArea from "../MessegeArea";

const DesktopChats = ({ setId }) => {
  const friends = [
    {
      name: "Jack",
      messege: "Hello I Am Jack, Co-Founder of jack.ai",
      url: "https://images.pexels.com/photos/10412892/pexels-photo-10412892.jpeg",
    },
    {
      name: "Rose",
      messege: "Heyy, Lets Hangout!",
      url: "https://images.pexels.com/photos/12010518/pexels-photo-12010518.png?_gl=1*1h84uxz*_ga*NjM2NzQyODgxLjE2Njg2MDcxNjc.*_ga_8JE65Q40S6*czE3NTYxMzI1OTckbzU4JGcxJHQxNzU2MTMyNjg5JGozMCRsMCRoMA..",
    },
    {
      name: "David",
      messege: "I have completed that ai model",
      url: "https://images.pexels.com/photos/9604299/pexels-photo-9604299.jpeg?_gl=1*xfu4kg*_ga*NjM2NzQyODgxLjE2Njg2MDcxNjc.*_ga_8JE65Q40S6*czE3NTYxMzI1OTckbzU4JGcxJHQxNzU2MTMyNjM2JGoyMSRsMCRoMA..",
    },
    {
      name: "David",
      messege: "I have completed that ai model",
      url: "https://images.pexels.com/photos/9604299/pexels-photo-9604299.jpeg?_gl=1*xfu4kg*_ga*NjM2NzQyODgxLjE2Njg2MDcxNjc.*_ga_8JE65Q40S6*czE3NTYxMzI1OTckbzU4JGcxJHQxNzU2MTMyNjM2JGoyMSRsMCRoMA..",
    },
    {
      name: "David",
      messege: "I have completed that ai model",
      url: "https://images.pexels.com/photos/9604299/pexels-photo-9604299.jpeg?_gl=1*xfu4kg*_ga*NjM2NzQyODgxLjE2Njg2MDcxNjc.*_ga_8JE65Q40S6*czE3NTYxMzI1OTckbzU4JGcxJHQxNzU2MTMyNjM2JGoyMSRsMCRoMA..",
    },
    {
      name: "David",
      messege: "I have completed that ai model",
      url: "https://images.pexels.com/photos/9604299/pexels-photo-9604299.jpeg?_gl=1*xfu4kg*_ga*NjM2NzQyODgxLjE2Njg2MDcxNjc.*_ga_8JE65Q40S6*czE3NTYxMzI1OTckbzU4JGcxJHQxNzU2MTMyNjM2JGoyMSRsMCRoMA..",
    },
    {
      name: "David",
      messege: "I have completed that ai model",
      url: "https://images.pexels.com/photos/9604299/pexels-photo-9604299.jpeg?_gl=1*xfu4kg*_ga*NjM2NzQyODgxLjE2Njg2MDcxNjc.*_ga_8JE65Q40S6*czE3NTYxMzI1OTckbzU4JGcxJHQxNzU2MTMyNjM2JGoyMSRsMCRoMA..",
    },
  ];

  // const handleMessegearea = (index) => {
  //   // console.log(index);
  //   setId(index)
  // };
  return (
    <div>
      {friends.map((friend, index) => (
        <div
          onClick={() => setId(index)}
          className="chat w-full p-3 flex justify-between items-center cursor-pointer mt-2"
        >
          <div className="flex gap-2 w-[80%]">
            <div className="w-[70px] h-[70px] rounded-[50px] overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={friend.url}
                alt="profile"
              />
            </div>

            <div className="">
              <h4 className="text-[1.4rem]">{friend.name}</h4>
              <h5 className="truncate w-[170px] md:w-[65vw] lg:w-[170px]">
                {friend.messege}
              </h5>
            </div>
          </div>
          <div className="text-center w-[20%] flex justify-center items-center flex-wrap">
            <h4 className="text-[#08CB00] w-full">8:13pm</h4>
            <h4 className="text-[#08CB00] font-bold rounded-[50px] w-full ">
              6
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DesktopChats;
