package com.worlabel.global.config.swagger;

import com.worlabel.global.exception.CustomException;
import com.worlabel.global.response.BaseResponse;
import com.worlabel.global.response.CustomError;
import com.worlabel.global.response.ErrorResponse;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.examples.Example;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;

import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;

import com.worlabel.global.exception.ErrorCode;

@Component
@AllArgsConstructor
public class CustomOperationCustomizer implements OperationCustomizer {

    @Override
    public Operation customize(Operation operation, HandlerMethod handlerMethod) {
        SwaggerApiError swaggerApiError = handlerMethod.getMethodAnnotation(SwaggerApiError.class);
        operation.getResponses().remove("500");
        if (swaggerApiError != null) {
            generateErrorCodeResponse(operation, swaggerApiError.value());
        }
        return operation;
    }

    //에러 코드로 error response 만들어 ApiResponse 에 넣음
    private void generateErrorCodeResponse(Operation operation, ErrorCode[] errorCodes) {
        ApiResponses responses = operation.getResponses();

        Map<Integer, List<BaseResponse<CustomError>>> statusWithErrorResponse = Arrays.stream(errorCodes)
                .map(errorCode -> ErrorResponse.of(new CustomException(errorCode)))
                .collect(Collectors.groupingBy(BaseResponse::getStatus));

        addErrorCodesToResponse(responses, statusWithErrorResponse);
    }

    //ApiResponses에 error response 추가
    private void addErrorCodesToResponse(ApiResponses apiResponses, Map<Integer, List<BaseResponse<CustomError>>> responses) {
        responses.forEach((status, value) -> {
            Content content = new Content();
            MediaType mediaType = new MediaType();
            ApiResponse apiResponse = new ApiResponse();

            value.forEach(
                    errorInfoResponse -> {
                        Example example = new Example();
                        example.setValue(errorInfoResponse);
                        mediaType.addExamples(String.valueOf(errorInfoResponse.getCode()), example);
                    });

            content.addMediaType("application/json", mediaType);
            apiResponse.setContent(content);
            apiResponses.addApiResponse(String.valueOf(status), apiResponse);
        });
    }
}
