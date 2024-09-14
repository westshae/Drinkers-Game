import { Injectable, UnauthorizedException } from "@nestjs/common";
import { createClient } from "@supabase/supabase-js";
import AvailableLocations from "src/interfaces/AvailableLocations";
import LocationColumn from "src/interfaces/LocationColumn";

@Injectable()
export class LocationService {
  async authenticateUser(session) {
    const supabase = createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_PRIV_API_KEY);
    const user = await supabase.auth.getUser(session.access_token);
    if (user.data.user.id === session.user.id) {
      return true
    }
    return false;
  }

  async getAvailableLocations() {
    const supabase = createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_PRIV_API_KEY);

    return await supabase.from("location").select("*");
  }
}