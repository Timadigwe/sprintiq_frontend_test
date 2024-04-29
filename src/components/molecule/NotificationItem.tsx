/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { type Notification } from "@prisma/client";
import moment from "moment";
import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface INotificationItemProps extends Notification {}

const NotificationItem: React.FC<INotificationItemProps> = props => {
  return (
    <section className="flex items-center justify-between">
      <div className="flex items-center text-lg sm:text-2xl">
        <div className="hidden h-0 w-0 border-b-[25px] border-l-[50px] border-t-[25px] border-b-transparent border-r-white border-t-transparent lg:block" />
        {/* <div className=""> */}
        <h2 className="ml-4 font-medium">{props.message}.</h2>
        {/* <p className="text-gray-500">{moment(props.created_at).fromNow()}</p> */}
        {/* </div> */}

        {props.ref_id && (
          <button className="ml-4 text-sm font-medium text-secondary-700 lg:text-lg">
            View Reward
          </button>
        )}
      </div>
    </section>
  );
};
export default NotificationItem;
