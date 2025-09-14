export interface NasaWeatherData {
  sol_keys?: string[];
  validity_checks?: {
    sol_hours_required?: number;
    sols_checked?: string[];
    [sol: string]: any | {
      AT?: {
        sol_hours_with_data?: number[];
        valid?: boolean;
      };
      HWS?: {
        sol_hours_with_data?: number[];
        valid?: boolean;
      };
      PRE?: {
        sol_hours_with_data?: number[];
        valid?: boolean;
      };
      WD?: {
        sol_hours_with_data?: number[];
        valid?: boolean;
      };
    };
  };
  [sol: string]: any;
}

export interface NasaSolData {
  AT?: {
    av?: number;
    ct?: number;
    mn?: number;
    mx?: number;
  };
  HWS?: {
    av?: number;
    ct?: number;
    mn?: number;
    mx?: number;
  };
  PRE?: {
    av?: number;
    ct?: number;
    mn?: number;
    mx?: number;
  };
  WD?: {
    most_common?: {
      compass_degrees?: number;
      compass_point?: string;
      compass_right?: number;
      compass_up?: number;
      ct?: number;
    };
    [key: string]: any;
  };
  First_UTC?: string;
  Last_UTC?: string;
  Season?: string;
}


