package com.worlabel.domain.result.service;

import com.worlabel.domain.result.entity.Result;
import com.worlabel.domain.result.entity.dto.ResultResponse;
import com.worlabel.domain.result.repository.ResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ResultService {

    private final ResultRepository resultRepository;

    public List<ResultResponse> getResultsByModelId(final Integer modelId) {
        List<Result> results = resultRepository.findByAiModelId(modelId);
        return results.stream()
                .map(ResultResponse::fromResult)
                .toList();
    }
}
