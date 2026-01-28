package com.moong.dto.response.groupmedical;

import com.moong.domain.enums.Disease;
import java.util.List;

public record PetDiseaseRankingResponse(
        List<Disease> diseases
) {
}
