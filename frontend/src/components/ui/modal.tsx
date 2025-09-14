import * as React from "react";

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ">
      <div className="w-[70%]">{children}</div>
    </div>
  );
};
