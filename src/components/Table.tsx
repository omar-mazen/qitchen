import React from "react";
import type { ReactNode, MouseEventHandler } from "react";

interface TableProps {
  children: ReactNode;
  footer?: ReactNode;
}

interface HeadProps {
  children: ReactNode;
}

interface CellProps {
  children: ReactNode;
  head?: boolean;
  bold?: boolean;
  center?: boolean;
}

interface BodyProps {
  children: ReactNode;
}

interface RowProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLTableRowElement>;
  disabled?: boolean;
}

interface FooterProps {
  children: ReactNode;
}

const Table: React.FC<TableProps> & {
  Head: React.FC<HeadProps>;
  Row: React.FC<RowProps>;
  Cell: React.FC<CellProps>;
  Body: React.FC<BodyProps>;
  Footer: React.FC<FooterProps>;
} = ({ children, footer }) => {
  return (
    <div>
      <div
        className={`rounded-2xl overflow-x-auto whitespace-nowrap w-full lg:mb-0 mb-[-0.6rem] border border-border ${
          footer ? "border-b-0 rounded-b-none" : ""
        }`}
      >
        <table className="table text-left w-full text-large">{children}</table>
      </div>
      {footer && (
        <div className="bg-background-muted rounded-b-2xl py-4 px-8 text-large w-full">
          {footer}
        </div>
      )}
    </div>
  );
};

const Head: React.FC<HeadProps> = ({ children }) => {
  return <thead className="bg-background-muted text-nowrap">{children}</thead>;
};

const Cell: React.FC<CellProps> = ({ children, head, bold, center = true }) => {
  if (head) {
    return (
      <th
        className={`py-4 px-8 text-ellipsis text-nowrap ${center ? "text-center" : "text-left"}`}
      >
        {children}
      </th>
    );
  }
  return (
    <th
      className={`py-4 px-8 text-nowrap text-ellipsis font-normal ${
        bold ? "font-semibold" : " font-[400]"
      } ${center ? "text-center" : "text-left"}`}
    >
      {children}
    </th>
  );
};

const Body: React.FC<BodyProps> = ({ children }) => {
  return <tbody>{children}</tbody>;
};

const Row: React.FC<RowProps> = ({ children, onClick, disabled }) => {
  return (
    <tr
      onClick={onClick}
      className={` relative border-b last-of-type:border-0 border-border ${
        onClick ? "cursor-pointer" : ""
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </tr>
  );
};

const Footer: React.FC<FooterProps> = ({ children }) => {
  return (
    <tfoot className="bg-background-muted appearance-none w-full text-left">
      {children}
    </tfoot>
  );
};

Table.Head = Head;
Table.Row = Row;
Table.Cell = Cell;
Table.Body = Body;
Table.Footer = Footer;

export default Table;
